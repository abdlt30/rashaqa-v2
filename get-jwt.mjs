const res = await fetch('https://axthmghawwishcjlldfj.supabase.co/auth/v1/token?grant_type=password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'sb_publishable_65sfnmWes7WZbqKmJ931-g_aakVowXY'
  },
  body: JSON.stringify({ email: 'test@rashaqa.app', password: 'Test123456!' })
});
const data = await res.json();
console.log(data.access_token);
