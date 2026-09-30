const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || '192.169.147.255',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'MEAZHA',
  password: process.env.DB_PASS || 'dZYRYi(o(0*U',
  database: process.env.DB_NAME || 'le_test',
};

async function initDatabase() {
  const conn = await mysql.createConnection(dbConfig);
  console.log('Connected to MySQL successfully.');

  try {
    // 1. Admins Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_admins created');

    // 2. Staff Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        specialization VARCHAR(150) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_staff created');

    // 3. Internship Tracks
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_internship_tracks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(150) NOT NULL,
        category ENUM('training', 'project') NOT NULL,
        domain VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        highlights TEXT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_internship_tracks created');

    // 4. Pricing Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_pricing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category ENUM('training', 'project') NOT NULL,
        mode ENUM('online', 'offline') NOT NULL,
        duration VARCHAR(50) NOT NULL,
        duration_label VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        allows_coupon TINYINT(1) DEFAULT 0,
        features TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY cat_mode_dur (category, mode, duration)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_pricing created');

    // 5. Coupons Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        discount_type ENUM('percentage', 'fixed') NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        applicable_category VARCHAR(50) DEFAULT 'project',
        min_amount DECIMAL(10,2) DEFAULT 0.00,
        max_uses INT DEFAULT 100,
        used_count INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        expires_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_coupons created');

    // 6. Batches Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batch_name VARCHAR(150) NOT NULL,
        category ENUM('training', 'project') NOT NULL,
        track_id INT NULL,
        mode ENUM('online', 'offline') NOT NULL,
        staff_id INT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_batches created');

    // 7. Students Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(15) NOT NULL,
        dob DATE NOT NULL,
        address TEXT NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        track_id INT NULL,
        track_name VARCHAR(150) NOT NULL,
        category ENUM('training', 'project') NOT NULL,
        mode ENUM('online', 'offline') NOT NULL,
        duration VARCHAR(50) NOT NULL,
        total_fee DECIMAL(10,2) NOT NULL,
        coupon_code VARCHAR(50) NULL,
        coupon_discount DECIMAL(10,2) DEFAULT 0.00,
        initial_amount_paid DECIMAL(10,2) NOT NULL,
        initial_payment_id VARCHAR(100) NULL,
        balance_fee DECIMAL(10,2) NOT NULL,
        balance_paid TINYINT(1) DEFAULT 0,
        balance_amount_paid DECIMAL(10,2) DEFAULT 0.00,
        balance_payment_id VARCHAR(100) NULL,
        referral_code VARCHAR(50) NOT NULL UNIQUE,
        referred_by_code VARCHAR(50) NULL,
        referee_discount_applied DECIMAL(10,2) DEFAULT 0.00,
        email_verified TINYINT(1) DEFAULT 0,
        email_otp VARCHAR(10) NULL,
        otp_expires_at DATETIME NULL,
        batch_id INT NULL,
        status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_students created');

    // 8. Payments Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        payment_type ENUM('initial_half', 'balance_final') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        razorpay_order_id VARCHAR(100) NOT NULL,
        razorpay_payment_id VARCHAR(100) NOT NULL,
        razorpay_signature VARCHAR(255) NOT NULL,
        status ENUM('success', 'failed', 'refunded') DEFAULT 'success',
        notes TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_payments created');

    // 9. Referrals Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_referrals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        referrer_student_id INT NOT NULL,
        referee_student_id INT NOT NULL,
        referrer_discount DECIMAL(10,2) DEFAULT 25.00,
        referee_discount DECIMAL(10,2) DEFAULT 25.00,
        is_paid TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_referrals created');

    // 10. Classes Table (Calendar / GMeet / Office timings)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batch_id INT NOT NULL,
        staff_id INT NOT NULL,
        class_title VARCHAR(200) NOT NULL,
        class_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        mode ENUM('online', 'offline') NOT NULL,
        gmeet_link VARCHAR(500) NULL,
        venue_instructions TEXT NULL,
        mail_sent TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_classes created');

    // 11. Certificates Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS altruisty_lms_certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        certificate_id VARCHAR(50) NOT NULL UNIQUE,
        student_id INT NOT NULL UNIQUE,
        issue_date DATE NOT NULL,
        grade VARCHAR(10) DEFAULT 'A+',
        verification_url VARCHAR(255) NOT NULL,
        issued_by_admin_id INT NULL,
        status ENUM('issued', 'revoked') DEFAULT 'issued',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altruisty_lms_certificates created');

    // --- SEED ESSENTIAL DATA ---

    // 1. Admin Seed
    const adminEmail = 'admin@altruistyinnovation.com';
    const [existingAdmin] = await conn.query('SELECT id FROM altruisty_lms_admins WHERE email = ?', [adminEmail]);
    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash('Admin@Altruisty2026!', 10);
      await conn.query(
        'INSERT INTO altruisty_lms_admins (name, email, password_hash) VALUES (?, ?, ?)',
        ['Altruisty Admin', adminEmail, passwordHash]
      );
      console.log('✓ Initial Admin seeded: admin@altruistyinnovation.com / Admin@Altruisty2026!');
    }

    // 2. Staff Seed
    const staffEmail = 'staff@altruistyinnovation.com';
    const [existingStaff] = await conn.query('SELECT id FROM altruisty_lms_staff WHERE email = ?', [staffEmail]);
    if (existingStaff.length === 0) {
      const passwordHash = await bcrypt.hash('Staff@Altruisty2026!', 10);
      await conn.query(
        'INSERT INTO altruisty_lms_staff (name, email, phone, password_hash, specialization) VALUES (?, ?, ?, ?, ?)',
        ['Technical Mentor', staffEmail, '9876543210', passwordHash, 'Full Stack & AI Development']
      );
      console.log('✓ Initial Staff seeded: staff@altruistyinnovation.com / Staff@Altruisty2026!');
    }

    // 3. Pricing Seed (Exact prices from prompt)
    const pricingData = [
      // Training Internship - Online
      { category: 'training', mode: 'online', duration: '15days', duration_label: '15 Days', price: 599.00, allows_coupon: 0, features: JSON.stringify(['Daily live mentor sessions', 'Hands-on coding exercises', 'Completion certificate', 'Resume review']) },
      { category: 'training', mode: 'online', duration: '1month', duration_label: '1 Month', price: 799.00, allows_coupon: 0, features: JSON.stringify(['Comprehensive syllabus', 'Live project assignments', 'Verified completion certificate', 'Doubt clearing support']) },
      { category: 'training', mode: 'online', duration: '2month', duration_label: '2 Months', price: 1499.00, allows_coupon: 0, features: JSON.stringify(['Advanced curriculum', 'Capstone project', 'Verified completion certificate', 'Placement preparation & guidance']) },

      // Training Internship - Offline
      { category: 'training', mode: 'offline', duration: '15days', duration_label: '15 Days', price: 699.00, allows_coupon: 0, features: JSON.stringify(['In-person classroom training', 'Direct mentor interaction', 'Lab workstation access', 'Completion certificate']) },
      { category: 'training', mode: 'offline', duration: '1month', duration_label: '1 Month', price: 999.00, allows_coupon: 0, features: JSON.stringify(['Classroom workshops & lab access', 'Hands-on practical development', 'Verified certificate', 'Mock interviews']) },
      { category: 'training', mode: 'offline', duration: '2month', duration_label: '2 Months', price: 1799.00, allows_coupon: 0, features: JSON.stringify(['Intensive offline boot camp', 'Real-world project implementation', 'Verified certificate', 'Direct placement recommendations']) },

      // Project Internship - Online (half days training, half days project dev, 1 Industry Visit)
      { category: 'project', mode: 'online', duration: '30days', duration_label: '30 Days (1 Month)', price: 1999.00, allows_coupon: 1, features: JSON.stringify(['Half days live training', 'Half days real-world project development', '1 Industry Visit / Virtual tour', 'Industry mentor review', 'Verified Experience Certificate']) },
      { category: 'project', mode: 'online', duration: '2month', duration_label: '2 Months', price: 2799.00, allows_coupon: 1, features: JSON.stringify(['Half days advanced training', 'Production client project development', '1 Industry Visit', 'Letter of Recommendation (LOR)', 'Verified Experience Certificate']) },

      // Project Internship - Offline
      { category: 'project', mode: 'offline', duration: '30days', duration_label: '30 Days (1 Month)', price: 1999.00, allows_coupon: 1, features: JSON.stringify(['Half days classroom training', 'Half days live project development', '1 In-Person Industry Visit', 'Dedicated office workstation', 'Verified Experience Certificate']) },
      { category: 'project', mode: 'offline', duration: '2month', duration_label: '2 Months', price: 2799.00, allows_coupon: 1, features: JSON.stringify(['In-depth project engineering', 'Live client deployment', '1 In-Person Industry Visit', 'Letter of Recommendation & Certificate', 'Full-time job interview prep']) },
    ];

    for (const p of pricingData) {
      await conn.query(`
        INSERT INTO altruisty_lms_pricing (category, mode, duration, duration_label, price, allows_coupon, features)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          price = VALUES(price),
          duration_label = VALUES(duration_label),
          allows_coupon = VALUES(allows_coupon),
          features = VALUES(features)
      `, [p.category, p.mode, p.duration, p.duration_label, p.price, p.allows_coupon, p.features]);
    }
    console.log('✓ All pricing tiers configured and synchronized');

    // 4. Internship Tracks Seed
    const tracks = [
      { slug: 'web-development', title: 'Full Stack Web Development', category: 'project', domain: 'Web Technologies', description: 'Master modern web applications with React, Next.js, Node.js, and databases with production deployment.', highlights: JSON.stringify(['Next.js & React 19', 'REST & GraphQL APIs', 'Database Design & SQL', 'Live Cloud Hosting']) },
      { slug: 'python-ai-ml', title: 'Python, AI & Machine Learning', category: 'project', domain: 'Artificial Intelligence', description: 'Build intelligent applications, predictive models, and LLM integrations using Python, Scikit-learn, and PyTorch.', highlights: JSON.stringify(['Python Data Stack', 'Supervised & Unsupervised ML', 'Deep Learning & NLP', 'Real AI Applications']) },
      { slug: 'data-science', title: 'Data Science & Business Analytics', category: 'project', domain: 'Data Science', description: 'Analyze large-scale datasets, extract actionable business insights, and create interactive data dashboards.', highlights: JSON.stringify(['Pandas & NumPy', 'SQL Analytics', 'Tableau & PowerBI', 'Statistical Modeling']) },
      { slug: 'mobile-app-dev', title: 'Mobile App Development (Flutter/React Native)', category: 'project', domain: 'Mobile Development', description: 'Develop cross-platform iOS and Android mobile applications with modern UI and cloud backend integration.', highlights: JSON.stringify(['Cross-Platform Architecture', 'State Management', 'Firebase Integration', 'Play Store Publishing']) },
      { slug: 'cyber-security', title: 'Cyber Security & Ethical Hacking', category: 'training', domain: 'Information Security', description: 'Learn vulnerability assessment, penetration testing, network defense, and ethical hacking protocols.', highlights: JSON.stringify(['Network Security', 'Vulnerability Assessment', 'Web App Penetration Testing', 'Security Compliance']) },
      { slug: 'cloud-devops', title: 'Cloud Computing & DevOps (AWS / Docker)', category: 'training', domain: 'Cloud & Infrastructure', description: 'Master CI/CD pipelines, containerization with Docker, Kubernetes, and AWS cloud architecture.', highlights: JSON.stringify(['AWS Cloud Fundamentals', 'Docker & Containers', 'CI/CD Pipelines', 'Infrastructure as Code']) },
      { slug: 'ui-ux-design', title: 'UI/UX Design & Product Prototyping', category: 'training', domain: 'Product Design', description: 'Create high-converting user interfaces, wireframes, user journeys, and interactive Figma prototypes.', highlights: JSON.stringify(['Design Systems', 'Figma Prototyping', 'User Research & Wireframing', 'Design to Code Handoff']) },
      { slug: 'embedded-iot', title: 'Embedded Systems & Internet of Things (IoT)', category: 'training', domain: 'Hardware & IoT', description: 'Interface sensors, microcontrollers (ESP32/Arduino), and build connected hardware cloud solutions.', highlights: JSON.stringify(['Microcontroller Programming', 'Sensor Interfacing', 'MQTT & IoT Cloud', 'Hardware Prototyping']) },
    ];

    for (const t of tracks) {
      await conn.query(`
        INSERT INTO altruisty_lms_internship_tracks (slug, title, category, domain, description, highlights)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          category = VALUES(category),
          domain = VALUES(domain),
          description = VALUES(description),
          highlights = VALUES(highlights)
      `, [t.slug, t.title, t.category, t.domain, t.description, t.highlights]);
    }
    console.log('✓ Internship tracks seeded');

    // 5. Coupons Seed
    const coupons = [
      { code: 'ALTRUISTY999', discount_type: 'fixed', discount_value: 999.00, applicable_category: 'project', min_amount: 1500.00 },
      { code: 'PROJECT10', discount_type: 'percentage', discount_value: 10.00, applicable_category: 'project', min_amount: 1500.00 },
    ];

    for (const c of coupons) {
      await conn.query(`
        INSERT INTO altruisty_lms_coupons (code, discount_type, discount_value, applicable_category, min_amount)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          discount_type = VALUES(discount_type),
          discount_value = VALUES(discount_value)
      `, [c.code, c.discount_type, c.discount_value, c.applicable_category, c.min_amount]);
    }
    console.log('✓ Coupons configured');

    console.log('🎉 Database initialization completed successfully!');
  } catch (err) {
    console.error('Error during database initialization:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

initDatabase();
