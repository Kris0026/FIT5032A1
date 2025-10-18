// functions/index.js (v2 API)
const { onCall, HttpsError, onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

try { admin.initializeApp(); } catch (e) { /* already init */ }


exports.healthAdvice = onCall({ region: 'australia-southeast1' }, async (request) => {
  const data = request && request.data ? request.data : {};
  const age  = Number(data.age || 0);
  const goal = String(data.goal || '').toLowerCase();
  const rhr  = Number(data.rhr || 0);

  if (!age || !goal) {
    throw new HttpsError('invalid-argument', 'Missing age or goal.');
  }

  
  let tip = 'Aim for 150 min/week of moderate activity, plus 2× strength.';
  if (goal.indexOf('weight') >= 0) tip = 'Slight calorie deficit + 150-300 min/week cardio.';
  if (goal.indexOf('muscle') >= 0) tip = 'Protein 1.6-2.2 g/kg + 3× full-body strength.';
  if (goal.indexOf('stress') >= 0) tip = '20-30 min walking daily + 10 min breathwork/yoga.';
  if (rhr && rhr > 90) tip += ' Your RHR is high; consider more recovery & consistent sleep.';

  
  try {
    const uid = request && request.auth ? request.auth.uid : null;
    await admin.firestore().collection('advice_logs').add({
      ts: admin.firestore.FieldValue.serverTimestamp(),
      uid, age, goal, rhr
    });
  } catch (e) {
    
  }

  return { advice: tip };
});


exports.helloPing = onRequest({ region: 'australia-southeast1' }, (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});
