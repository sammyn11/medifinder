import { getDb } from '../database/db.js';

/**
 * Script to link pharmacy user accounts to pharmacy records
 * Usage: node src/scripts/linkPharmacyUsers.js
 * 
 * This script matches pharmacy users by name/email to pharmacy records
 * and links them by setting the pharmacy_id in the users table
 */

function linkPharmacyUsers() {
  const db = getDb();
  
  console.log('🔗 Linking pharmacy users to pharmacy records...\n');
  
  // Get all pharmacy users
  const pharmacyUsers = db.prepare(`
    SELECT id, email, name, phone 
    FROM users 
    WHERE role = 'pharmacy' AND (pharmacy_id IS NULL OR pharmacy_id = '')
  `).all();
  
  if (pharmacyUsers.length === 0) {
    console.log('✅ No pharmacy users found that need linking.');
    return;
  }
  
  console.log(`Found ${pharmacyUsers.length} pharmacy user(s) to link:\n`);
  
  // Get all pharmacies
  const pharmacies = db.prepare('SELECT id, name, phone FROM pharmacies').all();
  
  let linked = 0;
  
  for (const user of pharmacyUsers) {
    // Try to match by name (case-insensitive, partial match)
    let matchedPharmacy = pharmacies.find(p => 
      p.name.toLowerCase().includes(user.name.toLowerCase()) ||
      user.name.toLowerCase().includes(p.name.toLowerCase())
    );
    
    // If no match by name, try by phone
    if (!matchedPharmacy && user.phone) {
      matchedPharmacy = pharmacies.find(p => 
        p.phone && (
          p.phone.replace(/\s+/g, '') === user.phone.replace(/\s+/g, '') ||
          p.phone.includes(user.phone) ||
          user.phone.includes(p.phone)
        )
      );
    }
    
    if (matchedPharmacy) {
      // Link the user to the pharmacy
      db.prepare('UPDATE users SET pharmacy_id = ? WHERE id = ?')
        .run(matchedPharmacy.id, user.id);
      
      console.log(`✅ Linked: ${user.name} (${user.email}) → ${matchedPharmacy.name}`);
      linked++;
    } else {
      console.log(`⚠️  No match found for: ${user.name} (${user.email})`);
      console.log(`   You can manually link this user to a pharmacy using:`);
      console.log(`   UPDATE users SET pharmacy_id = 'PHARMACY_ID' WHERE id = '${user.id}';`);
    }
  }
  
  console.log(`\n✅ Linked ${linked} out of ${pharmacyUsers.length} pharmacy user(s).`);
  
  if (linked < pharmacyUsers.length) {
    console.log('\n💡 To manually link remaining users, use:');
    console.log('   UPDATE users SET pharmacy_id = \'PHARMACY_ID\' WHERE id = \'USER_ID\';');
    console.log('\n   To see available pharmacies:');
    console.log('   SELECT id, name FROM pharmacies;');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  linkPharmacyUsers();
}

export { linkPharmacyUsers };
