import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ override: true });

export function resolveMongoUri(): string {
  // First, check .env on disk with override
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
      if (
        match &&
        match[1] &&
        !match[1].includes('<db_password>') &&
        !match[1].includes('<password>')
      ) {
        return match[1].trim();
      }
    }
  } catch (e) {
    // ignore
  }

  let uri = process.env.MONGODB_URI || '';
  // If sonukr7435_db_user provided password ZhkVkMZHhj7HvEeg
  if (
    uri.includes('sonukr7435_db_user') &&
    (uri.includes('<db_password>') || uri.includes('<password>'))
  ) {
    uri = uri.replace('<db_password>', 'ZhkVkMZHhj7HvEeg').replace('<password>', 'ZhkVkMZHhj7HvEeg');
  }

  // Ensure campushire database is targeted
  if (uri.includes(':27017/?') || uri.includes(':27017?')) {
    uri = uri.replace(':27017/?', ':27017/campushire?').replace(':27017?', ':27017/campushire?');
  }

  return uri;
}

export interface DbStatusInfo {
  status: 'connected' | 'connecting' | 'disconnected' | 'local_fallback';
  databaseName?: string;
  host?: string;
  isAtlas: boolean;
  message: string;
  hint?: string;
  detectedUser?: string;
  detectedCluster?: string;
  hasPasswordPlaceholder?: boolean;
}

let dbState: DbStatusInfo = {
  status: 'disconnected',
  isAtlas: false,
  message: 'Initializing database connection...',
};

/**
 * Parses user and host details from connection string
 */
function parseUriDetails(uri: string) {
  let user: string | undefined;
  let cluster: string | undefined;
  try {
    const authMatch = uri.match(/:\/\/([^:]+):([^@]+)@([^/?]+)/);
    if (authMatch) {
      user = authMatch[1];
      cluster = authMatch[3].split(',')[0].replace(/:27017/, '');
    }
  } catch (e) {
    // ignore parse error
  }
  return { user, cluster };
}

/**
 * Validates whether the MongoDB URI is ready for a real connection attempt
 * or if it contains unconfigured placeholders like <db_password> or <username>.
 */
function inspectMongoUri(uri: string): { isReady: boolean; message: string; hint?: string; isPlaceholderPass?: boolean } {
  if (!uri || !uri.trim()) {
    return {
      isReady: false,
      message: 'MONGODB_URI is not set. Operating in local simulated storage mode.',
      hint: 'Add your MongoDB Atlas URI in environment secrets to connect live MongoDB.',
    };
  }

  if (uri.includes('MY_MONGODB_URI')) {
    return {
      isReady: false,
      message: 'MONGODB_URI contains default placeholder.',
      hint: 'Update MONGODB_URI in secrets with your actual MongoDB connection string.',
    };
  }

  if (uri.includes('<username>') || uri.includes('<db_user>')) {
    return {
      isReady: false,
      message: "MONGODB_URI has '<username>' placeholder.",
      hint: 'Replace <username> with your MongoDB database user.',
    };
  }

  if (uri.includes('<db_password>') || uri.includes('<password>')) {
    return {
      isReady: false,
      isPlaceholderPass: true,
      message: "MongoDB Atlas URI contains '<db_password>' placeholder.",
      hint: "Enter your MongoDB Atlas user password below or replace '<db_password>' in your connection string.",
    };
  }

  // Check for any remaining angle brackets in user or password portion
  const authMatch = uri.match(/:\/\/([^@]+)@/);
  if (authMatch && (authMatch[1].includes('<') || authMatch[1].includes('>'))) {
    return {
      isReady: false,
      isPlaceholderPass: true,
      message: 'MONGODB_URI credentials contain unreplaced <...> angle brackets.',
      hint: 'Enter your database password without angle brackets.',
    };
  }

  return { isReady: true, message: 'Ready to connect' };
}

export async function connectMongo(): Promise<DbStatusInfo> {
  const uri = resolveMongoUri();
  const inspection = inspectMongoUri(uri);
  const { user, cluster } = parseUriDetails(uri);

  if (!inspection.isReady) {
    dbState = {
      status: 'local_fallback',
      isAtlas: uri.includes('mongodb+srv://') || uri.includes('mongodb.net'),
      message: inspection.message,
      hint: inspection.hint,
      detectedUser: user,
      detectedCluster: cluster,
      hasPasswordPlaceholder: inspection.isPlaceholderPass,
    };
    console.log(`[Database] Notice: ${dbState.message} Local resilient storage is active.`);
    return dbState;
  }

  try {
    dbState = {
      status: 'connecting',
      isAtlas: uri.includes('mongodb+srv://') || uri.includes('mongodb.net'),
      message: 'Connecting to MongoDB...',
      detectedUser: user,
      detectedCluster: cluster,
    };
    console.log(`[Database] Connecting to MongoDB: ${uri.replace(/\/\/.*@/, '//****:****@')}`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    const conn = mongoose.connection;
    dbState = {
      status: 'connected',
      databaseName: conn.name || 'campushire',
      host: conn.host,
      isAtlas: uri.includes('mongodb+srv://') || uri.includes('mongodb.net'),
      message: `Successfully connected to MongoDB (${conn.name || 'campushire'}) on ${conn.host}`,
      detectedUser: user,
      detectedCluster: cluster,
    };
    console.log(`[Database] ${dbState.message}`);

    conn.on('error', (err) => {
      console.log(`[Database] Connection notice: ${err.message}`);
      dbState = {
        status: 'disconnected',
        isAtlas: dbState.isAtlas,
        message: `MongoDB error: ${err.message}`,
        detectedUser: user,
        detectedCluster: cluster,
      };
    });

    conn.on('disconnected', () => {
      console.log('[Database] MongoDB disconnected. Local resilient storage is active.');
      dbState = {
        status: 'local_fallback',
        isAtlas: dbState.isAtlas,
        message: 'MongoDB disconnected. Operating in local resilient mode.',
        detectedUser: user,
        detectedCluster: cluster,
      };
    });

    return dbState;
  } catch (error: any) {
    const isAuthError = error.message.includes('authentication failed') || error.message.includes('bad auth');
    console.log(`[Database] Connection notice: ${error.message}. Running in local resilient mode.`);
    dbState = {
      status: 'local_fallback',
      isAtlas: uri.includes('mongodb+srv://') || uri.includes('mongodb.net'),
      message: isAuthError
        ? 'MongoDB authentication failed. Check database username & password in Atlas.'
        : `Could not reach MongoDB (${error.message}). Local resilient storage is active.`,
      hint: isAuthError
        ? 'Ensure your MongoDB Atlas user exists in "Database Access" and the password is correct (URL-encoded if special chars).'
        : 'Verify Network Access in MongoDB Atlas (allow 0.0.0.0/0).',
      detectedUser: user,
      detectedCluster: cluster,
      hasPasswordPlaceholder: isAuthError,
    };
    return dbState;
  }
}

/**
 * Dynamically applies a new MongoDB connection string or password
 */
export async function applyMongoUri(newUri: string): Promise<{ success: boolean; message: string; status: DbStatusInfo }> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log(`[Database] Attempting connection to: ${newUri.replace(/\/\/.*@/, '//****:****@')}`);
    await mongoose.connect(newUri, {
      serverSelectionTimeoutMS: 8000,
    });

    const conn = mongoose.connection;
    const { user, cluster } = parseUriDetails(newUri);
    dbState = {
      status: 'connected',
      databaseName: conn.name || 'campushire',
      host: conn.host,
      isAtlas: newUri.includes('mongodb+srv://') || newUri.includes('mongodb.net'),
      message: `Successfully connected to MongoDB Atlas (${conn.name || 'campushire'})`,
      detectedUser: user,
      detectedCluster: cluster,
      hasPasswordPlaceholder: false,
    };

    process.env.MONGODB_URI = newUri;

    // Save to local .env if possible
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      let content = '';
      if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
      }
      if (content.includes('MONGODB_URI=')) {
        content = content.replace(/MONGODB_URI=.*/, `MONGODB_URI="${newUri}"`);
      } else {
        content += `\nMONGODB_URI="${newUri}"\n`;
      }
      fs.writeFileSync(envPath, content);
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      message: `Successfully connected to MongoDB Atlas (${conn.name || 'campushire'})!`,
      status: dbState,
    };
  } catch (err: any) {
    const isAuth = err.message.includes('authentication failed') || err.message.includes('bad auth');
    const isIp = err.message.includes('whitelist') || err.message.includes('timed out') || err.message.includes('Server selection timed out');

    let userMsg = err.message;
    if (isAuth) {
      userMsg = 'Authentication failed: The password entered does not match MongoDB Atlas credentials for this user.';
    } else if (isIp) {
      userMsg = 'Connection timed out. In MongoDB Atlas, go to "Network Access" and ensure "0.0.0.0/0" (Allow Access from Anywhere) is enabled.';
    }

    const { user, cluster } = parseUriDetails(newUri);
    dbState = {
      status: 'local_fallback',
      isAtlas: true,
      message: userMsg,
      hint: isAuth ? 'Verify your password in MongoDB Atlas > Database Access.' : 'Check Network Access (0.0.0.0/0) in Atlas.',
      detectedUser: user,
      detectedCluster: cluster,
      hasPasswordPlaceholder: true,
    };

    return {
      success: false,
      message: userMsg,
      status: dbState,
    };
  }
}

export function getDbStatus(): DbStatusInfo {
  const currentUri = resolveMongoUri();
  if (mongoose.connection.readyState === 1) {
    const { user, cluster } = parseUriDetails(currentUri);
    return {
      status: 'connected',
      databaseName: mongoose.connection.name || 'campushire',
      host: mongoose.connection.host,
      isAtlas: currentUri.includes('mongodb+srv://') || currentUri.includes('mongodb.net'),
      message: `Connected to MongoDB Atlas (${mongoose.connection.name || 'campushire'})`,
      detectedUser: user,
      detectedCluster: cluster,
      hasPasswordPlaceholder: false,
    };
  }
  return dbState;
}
