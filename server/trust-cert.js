const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, 'ssl');
const certPath = path.join(certDir, 'cert.pem');
const certCrtPath = path.join(certDir, 'localhost.crt');

// Check if certificate exists
if (!fs.existsSync(certPath)) {
    console.error('❌ Certificate not found. Please run "npm run generate-cert" first.');
    process.exit(1);
}

console.log('🔐 Adding certificate to Windows Trusted Root Store...');
console.log('⚠️  This requires Administrator privileges.\n');

try {
    // Copy certificate to .crt format (Windows prefers this)
    const certContent = fs.readFileSync(certPath, 'utf8');
    fs.writeFileSync(certCrtPath, certContent);
    console.log('✅ Certificate copied to .crt format');

    // PowerShell command to import certificate
    // Use single quotes and escape properly for PowerShell
    const certPathEscaped = certCrtPath.replace(/\\/g, '\\\\').replace(/'/g, "''");
    const psCommand = [
        '$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("' + certPathEscaped + '")',
        '$store = New-Object System.Security.Cryptography.X509Certificates.X509Store([System.Security.Cryptography.X509Certificates.StoreName]::Root, [System.Security.Cryptography.X509Certificates.StoreLocation]::CurrentUser)',
        '$store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)',
        'try {',
        '    $store.Add($cert)',
        '    Write-Host "Certificate added successfully!"',
        '} catch {',
        '    if ($_.Exception.Message -like "*already exists*") {',
        '        Write-Host "Certificate already exists in trust store."',
        '    } else {',
        '        Write-Host "Error: $($_.Exception.Message)"',
        '        exit 1',
        '    }',
        '} finally {',
        '    $store.Close()',
        '}'
    ].join('; ');

    // Execute PowerShell command
    console.log('Adding certificate to Current User Trusted Root Store...\n');
    execSync(`powershell -Command "${psCommand}"`, { 
        stdio: 'inherit',
        shell: true
    });

    console.log('\n✅ Certificate has been added to Windows Trusted Root Store!');
    console.log('\n📝 Next steps:');
    console.log('   1. Close and restart your browser completely');
    console.log('   2. Visit https://localhost:3000');
    console.log('   3. The certificate should now be trusted (green lock icon)');
    console.log('\n⚠️  Note: If you still see a warning, try:');
    console.log('   - Restart your computer');
    console.log('   - Clear browser cache');
    console.log('   - Try a different browser');

} catch (error) {
    if (error.status === 1) {
        // PowerShell error already displayed
        process.exit(1);
    }
    
    console.error('\n❌ Error adding certificate:', error.message);
    
    if (error.message.includes('Access is denied') || error.message.includes('administrator')) {
        console.error('\n⚠️  Administrator privileges required!');
        console.error('\n📝 Manual steps:');
        console.error('   1. Right-click PowerShell and select "Run as Administrator"');
        console.error('   2. Navigate to your project directory');
        console.error(`   3. Run: npm run trust-cert`);
        console.error('\n   OR manually:');
        console.error(`   1. Open: ${certCrtPath}`);
        console.error('   2. Click "Install Certificate..."');
        console.error('   3. Select "Current User" → Next');
        console.error('   4. Select "Place all certificates in the following store"');
        console.error('   5. Click "Browse" → Select "Trusted Root Certification Authorities" → OK');
        console.error('   6. Click Next → Finish → Yes');
    } else {
        console.error('\n📝 Alternative: Import manually');
        console.error(`   1. Double-click: ${certCrtPath}`);
        console.error('   2. Click "Install Certificate..."');
        console.error('   3. Follow the wizard to add to Trusted Root Certification Authorities');
    }
    
    process.exit(1);
}

