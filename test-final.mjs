const authRes = await fetch('https://axthmghawwishcjlldfj.supabase.co/auth/v1/token?grant_type=password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'apikey': 'sb_publishable_65sfnmWes7WZbqKmJ931-g_aakVowXY' },
  body: JSON.stringify({ email: 'test@rashaqa.app', password: 'Test123456!' })
});
const { access_token } = await authRes.json();

const res = await fetch('https://axthmghawwishcjlldfj.supabase.co/functions/v1/smart-service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
  body: JSON.stringify({
    action: 'suggest',
    body: { country: 'MA', goal: 'maintain', remainingCalories: 800 }
  })
});

const data = await res.json();
console.log('=== FULL RESPONSE ===');
console.log(JSON.stringify(data, null, 2));
