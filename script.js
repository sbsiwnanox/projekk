
// script.js - Versi Terpadu

// Fungsi untuk menampilkan pesan
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}

// Fungsi untuk menyimpan data (simulasi GitHub dengan localStorage)
async function saveData(number, name) {
    // Mode simulasi (gunakan localStorage)
    if (typeof localStorage !== 'undefined') {
        let numbers = JSON.parse(localStorage.getItem('numbers')) || [];
        numbers.push({
            number: number,
            name: name,
            date: new Date().toISOString()
        });
        
        localStorage.setItem('numbers', JSON.stringify(numbers));
        return true;
    }
    
    // Mode GitHub API (jika diimplementasikan)
    // return await saveToGitHub(number, name);
}

// Fungsi untuk menampilkan data
function displayNumbers() {
    let numbers = [];
    
    // Cek dari localStorage (simulasi)
    if (typeof localStorage !== 'undefined') {
        numbers = JSON.parse(localStorage.getItem('numbers')) || [];
    }
    
    const numberListDiv = document.getElementById('numberList');
    numberListDiv.innerHTML = '<h2>Daftar Nomor</h2>';
    
    if (numbers.length === 0) {
        numberListDiv.innerHTML += '<p>Belum ada nomor yang tersimpan.</p>';
        return;
    }
    
    numbers.forEach(item => {
        const div = document.createElement('div');
        div.className = 'number-item';
        div.innerHTML = `
            <strong>${item.number}</strong> - ${item.name}
            <small>${new Date(item.date).toLocaleString()}</small>
        `;
        numberListDiv.appendChild(div);
    });
}

// Fungsi untuk menangani submit form
document.getElementById('numberForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const number = document.getElementById('numberInput').value;
    const name = document.getElementById('nameInput').value || 'Anonim';
    
    // Validasi nomor
    if (!number.match(/^[0-9]+$/)) {
        showMessage('Nomor hanya boleh mengandung angka!', 'error');
        return;
    }
    
    try {
        const success = await saveData(number, name);
        if (success) {
            showMessage('Nomor berhasil ditambahkan!', 'success');
            document.getElementById('numberInput').value = '';
            document.getElementById('nameInput').value = '';
            displayNumbers();
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Gagal menyimpan data', 'error');
    }
});

// Fungsi untuk menyimpan ke GitHub (opsional)
async function saveToGitHub(number, name) {
     
    Implementasi nyata dengan GitHub API:
    
    const token = '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';
    const repo = 'sbsiwnanox/dbrbl';
    const path = 'database.json';
    
    try {
        // 1. Dapatkan data yang ada
        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            headers: { 'Authorization': `token ${token}` }
        });
        
        let content = '';
        let sha = '';
        
        if (response.ok) {
            const data = await response.json();
            content = atob(data.content);
            sha = data.sha;
        }
        
        // 2. Parse data dan tambahkan yang baru
        const numbers = content ? JSON.parse(content) : [];
        numbers.push({ number, name, date: new Date().toISOString() });
        
        // 3. Update file di GitHub
        const updateResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Add new number',
                content: btoa(JSON.stringify(numbers, null, 2)),
                sha: sha
            })
        });
        
        return updateResponse.ok;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
    
}

// Inisialisasi: Tampilkan data saat pertama kali load
document.addEventListener('DOMContentLoaded', displayNumbers);
