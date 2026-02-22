import mongoose from 'mongoose';
import colors from 'colors';
import dns from 'node:dns/promises';

export const config = {
    database: async () => {
        try {
            // Force Public DNS Inside Node.js(Keep + srvlookup: false for mongoose connection)
            dns.setServers(['1.1.1.1', '8.8.8.8']);
            console.log('Using Cloudflare/Google DNS for resolution'.yellow);
            
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

        } catch (error) {
            console.error(`Error: ${error.message}`.red.underline.bold);
            process.exit(1);
        }       
    }
}
