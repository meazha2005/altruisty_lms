async function runTests() {
  const BASE_URL = 'http://localhost:3000';
  console.log('🚀 Running E2E Integration Tests on', BASE_URL);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test /api/internships
    const internshipsRes = await fetch(`${BASE_URL}/api/internships`);
    const internshipsData = await internshipsRes.json();
    assert(internshipsRes.status === 200, 'GET /api/internships returns 200');
    assert(internshipsData.tracks.length >= 8, `Internship tracks loaded: ${internshipsData.tracks.length}`);
    assert(internshipsData.pricing.length >= 10, `Pricing tiers loaded: ${internshipsData.pricing.length}`);

    // Verify exact pricing
    const trainingOnline15 = internshipsData.pricing.find(
      (p) => p.category === 'training' && p.mode === 'online' && p.duration === '15days'
    );
    assert(Number(trainingOnline15.price) === 599, 'Training Online 15days is ₹599');

    const projectOnline30 = internshipsData.pricing.find(
      (p) => p.category === 'project' && p.mode === 'online' && p.duration === '30days'
    );
    assert(Number(projectOnline30.price) === 1999, 'Project Online 30days is ₹1999');

    // 2. Test /api/validate-coupon
    const couponRes = await fetch(`${BASE_URL}/api/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ALTRUISTY200', category: 'project', price: 1999 }),
    });
    const couponData = await couponRes.json();
    assert(couponData.valid === true, 'Coupon ALTRUISTY200 is valid for Project Internship');
    assert(couponData.discountAmount === 200, 'Coupon discount amount is ₹200');

    // Test coupon on training (must be rejected)
    const trainingCouponRes = await fetch(`${BASE_URL}/api/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ALTRUISTY200', category: 'training', price: 799 }),
    });
    const trainingCouponData = await trainingCouponRes.json();
    assert(trainingCouponData.valid === false, 'Coupon rejected for Training Internship as required');

    // 3. Test Registration Intent & 50% half payment calculation
    const regIntentRes = await fetch(`${BASE_URL}/api/auth/register-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `student_test_${Date.now()}@altruisty.com`,
        phone: '9876543210',
        dob: '2002-05-15',
        address: '123 Chennai St, Tamil Nadu',
        category: 'project',
        mode: 'online',
        duration: '30days',
        password: 'password123',
        confirmPassword: 'password123',
        coupon_code: 'ALTRUISTY200',
      }),
    });
    const regIntentData = await regIntentRes.json();
    assert(regIntentRes.status === 200, 'POST /api/auth/register-intent returns 200');
    assert(regIntentData.totalFee === 1799, 'Total fee with coupon is ₹1799 (1999 - 200)');
    assert(regIntentData.amount === 900, 'Initial half payment is ₹900 (Math.ceil(1799 / 2))');
    assert(regIntentData.orderId && regIntentData.orderId.startsWith('order_'), `Razorpay order generated: ${regIntentData.orderId}`);

    // 4. Test Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@altruistyinnovation.com',
        password: 'Admin@Altruisty2026!',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login succeeded');
    assert(adminLoginData.user.role === 'admin', 'Admin role verified in session');

    const adminCookie = adminLoginRes.headers.get('set-cookie');
    assert(!!adminCookie, 'Admin session cookie returned');

    // 5. Test Admin Stats with Session Cookie
    const adminStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: adminCookie },
    });
    const adminStatsData = await adminStatsRes.json();
    assert(adminStatsRes.status === 200, 'Admin stats retrieved successfully');
    assert(adminStatsData.stats.totalStaff >= 1, `Total staff count: ${adminStatsData.stats.totalStaff}`);

    // 6. Test Staff Login
    const staffLoginRes = await fetch(`${BASE_URL}/api/auth/staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'staff@altruistyinnovation.com',
        password: 'Staff@Altruisty2026!',
      }),
    });
    const staffLoginData = await staffLoginRes.json();
    assert(staffLoginRes.status === 200, 'Staff login succeeded');
    assert(staffLoginData.user.role === 'staff', 'Staff role verified in session');

    console.log(`\n================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`================================`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
