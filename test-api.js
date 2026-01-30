
async function test() {
    try {
        const response = await fetch('http://localhost:3000/api/eligibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                age: 30,
                income: 50000,
                bplStatus: false,
                name: "Test",
                district: "Delhi"
            })
        });
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (e) {
        console.error(e);
    }
}

test();
