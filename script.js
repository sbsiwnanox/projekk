// Fungsi untuk menyimpan ke GitHub
async function saveToGitHub(number) {
    const token = "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"; // 🔴 Ganti dengan token GitHub pribadi Anda!
    const repo = "sbsiwnanox/dbrbl";     // Contoh: "sbsiwnanox/dbrbl"
    const path = "database.json";           // Pastikan path-nya benar

    try {
        // 1. Ambil data yang sudah ada dari GitHub
        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            headers: { 'Authorization': `token ${token}` }
        });
        
        if (!response.ok) throw new Error("Gagal mengambil data");
        
        const data = await response.json();
        const content = JSON.parse(atob(data.content.replace(/\s/g, ''))); // Decode base64
        
        // 2. Pastikan struktur `users` ada
        if (!content.users) content.users = [];
        
        // 3. Cek duplikat & tambahkan nomor baru
        const formattedNumber = number.trim();
        if (!content.users.includes(formattedNumber)) {
            content.users.push(formattedNumber);
        } else {
            throw new Error("Nomor sudah ada di database!");
        }
        
        // 4. Update file di GitHub
        const updateResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Menambahkan nomor baru",
                content: btoa(JSON.stringify(content, null, 2)), // Encode ke base64
                sha: data.sha, // SHA file yang diperlukan untuk update
            }),
        });
        
        if (!updateResponse.ok) throw new Error("Gagal update data");
        return true;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Fungsi untuk handle form submit
document.getElementById("numberForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const number = document.getElementById("numberInput").value.trim();
    
    // Validasi: Pastikan nomor hanya angka
    if (!number.match(/^[0-9]+$/)) {
        alert("Nomor hanya boleh mengandung angka!");
        return;
    }
    
    try {
        await saveToGitHub(number);
        alert("Nomor berhasil ditambahkan ke database.json!");
        document.getElementById("numberInput").value = "";
    } catch (error) {
        alert(`Gagal: ${error.message}`);
    }
});
