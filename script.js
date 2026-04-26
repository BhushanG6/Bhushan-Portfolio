// =====================================
// THEME MANAGEMENT
// =====================================
function toggleTheme() {
  const html = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
  const themeText = themeToggle.querySelector('span:last-child');

  const isDark = html.getAttribute('data-theme') !== 'light';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');

  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeText.textContent = isDark ? 'Light' : 'Dark';

  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Load saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'light') {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.querySelector('.theme-toggle-icon').textContent = '☀️';
    themeToggle.querySelector('span:last-child').textContent = 'Light';
  }
}

// =====================================
// SCROLL EFFECTS
// =====================================
function initScrollEffects() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update scroll progress
    document.querySelector('.scroll-progress').style.transform = `scaleX(${scrollPercent / 100})`;

    // Show/hide back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (scrollTop > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNavLink();
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let currentSection = '';
  
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) {
      currentSection = s.id;
    }
  });
  
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${currentSection}` ? 'var(--bright)' : '';
  });
}

// =====================================
// SCROLL REVEAL ANIMATION
// =====================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  
  elements.forEach(el => observer.observe(el));
}

// =====================================
// GITHUB STATS
// =====================================
async function fetchGitHubStats() {
  try {
    const response = await fetch('https://api.github.com/users/BhushanG6');
    const data = await response.json();

    document.getElementById('repos-count').textContent = data.public_repos;
    document.getElementById('followers-count').textContent = data.followers;

    // Fetch stars count
    const reposResponse = await fetch('https://api.github.com/users/BhushanG6/repos?per_page=100');
    const repos = await reposResponse.json();
    const stars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
    document.getElementById('stars-count').textContent = stars;

    // Mock contributions count
    document.getElementById('contributions-count').textContent = '150+';

  } catch (error) {
    console.log('GitHub API fetch failed, using placeholder data');
    document.getElementById('repos-count').textContent = '12';
    document.getElementById('stars-count').textContent = '25';
    document.getElementById('followers-count').textContent = '45';
    document.getElementById('contributions-count').textContent = '150+';
  }
}

// =====================================
// CONTACT FORM
// =====================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');

    status.textContent = 'Sending...';
    status.style.color = 'var(--accent2)';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.textContent = 'Message sent successfully! 🎉';
        status.style.color = 'var(--accent2)';
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      status.textContent = 'Failed to send message. Please try again.';
      status.style.color = 'var(--red)';
    }
  });
}

// =====================================
// RESUME DOWNLOAD
// =====================================
function downloadResume() {
  const link = document.createElement('a');
  link.href = '#';
  link.download = 'Bhushan_Gajare_Resume.pdf';
  link.click();
  alert('Resume download feature - Add your resume PDF to the project and update the download link!');
}

// =====================================
// BLOG FUNCTIONALITY
// =====================================
const blogPosts = {
  1: {
    title: 'Debugging DYLD crashes that only happen outside Xcode',
    date: 'Apr 12, 2026',
    readTime: '5 min read',
    tags: ['Debugging', 'iOS', 'Performance'],
    content: `
      <h3>The Mystery</h3>
      <p>You're running your app in Xcode and everything works perfectly. You submit to TestFlight, the testers download it, and suddenly: <code>dyld: lazy symbol binding failed</code>. The app crashes immediately. But when you run it from Xcode? Not a single crash.</p>
      
      <h4>Root Cause Analysis</h4>
      <p>This is a classic DYLD linker issue that manifests differently in debug vs release builds. Several things are happening:</p>
      <ul>
        <li><strong>Lazy Binding:</strong> By default, iOS uses lazy binding which defers resolving symbols until they're actually needed. In debug builds, symbols are loaded eagerly with <code>DYLD_BIND_AT_LAUNCH</code>.</li>
        <li><strong>Library Search Paths:</strong> Your debug scheme includes local framework paths that don't exist in the TestFlight build.</li>
        <li><strong>Weak Imports:</strong> You're importing a symbol as weak, but it's not actually available in the OS version the user is running.</li>
      </ul>

      <h4>The Solution</h4>
      <p>First, enable strict binding to catch these issues early:</p>
      <pre>DYLD_BIND_AT_LAUNCH = YES</pre>
      
      <p>Check your framework search paths don't include device-specific builds:</p>
      <pre>FRAMEWORK_SEARCH_PATHS = $(SRCROOT)/Frameworks</pre>

      <p>For weak imports, always check availability:</p>
      <pre>@available(iOS 14, *)
let newAPI = SomeNewClass()
#else
// Fallback for older iOS versions
#endif</pre>

      <h4>Prevention</h4>
      <p>Use Xcode's Scheme Editor to ensure your debug configuration matches your release configuration as closely as possible. Run regular builds and test on actual devices with different iOS versions.</p>
    `
  },
  2: {
    title: 'Hybrid RSA+AES encryption in a real banking app',
    date: 'Mar 28, 2026',
    readTime: '8 min read',
    tags: ['Security', 'Encryption', 'Banking'],
    content: `
      <h3>Securing Sensitive Financial Data</h3>
      <p>At HSBC, we handle sensitive customer financial data. While network encryption (TLS 1.3) is the baseline, we implemented an additional layer of encryption at the application level using a hybrid RSA+AES approach.</p>

      <h4>Why Hybrid Encryption?</h4>
      <p>RSA is secure but slow. AES is fast but requires secure key exchange. The solution: use RSA to securely transmit AES keys, then use AES to encrypt the actual data.</p>

      <h4>Implementation Strategy</h4>
      <p><strong>1. Key Management:</strong></p>
      <ul>
        <li>RSA 2048-bit public key embedded in the app (for key exchange)</li>
        <li>Private key stored securely on backend servers</li>
        <li>AES-256 session keys generated per transaction</li>
      </ul>

      <p><strong>2. Secure Enclave Integration:</strong></p>
      <p>We leveraged the Secure Enclave to store sensitive cryptographic material:</p>
      <pre>let privateKey = try SecKey.createSecureEnclavePrivateKey(...)
let publicKey = SecKeyCopyPublicKey(privateKey)</pre>

      <h4>Best Practices Learned</h4>
      <ul>
        <li>Always use authenticated encryption (GCM mode) to prevent tampering</li>
        <li>Include timestamps in encrypted payloads to prevent replay attacks</li>
        <li>Rotate session keys frequently (every 5 minutes or per transaction)</li>
      </ul>
    `
  },
  3: {
    title: 'Building a plugin-based iOS architecture from scratch',
    date: 'Mar 15, 2026',
    readTime: '12 min read',
    tags: ['Architecture', 'Modular Design', 'Swift'],
    content: `
      <h3>The Why: Modularity at Scale</h3>
      <p>As our banking app grew to 50+ feature modules, we needed a system where teams could develop features independently without creating tight coupling. The solution: a plugin-based architecture.</p>

      <h4>Core Concept</h4>
      <p>Each feature is built as a dynamic framework that implements a common protocol. The main app acts as a container that discovers and loads plugins at runtime.</p>

      <h4>Lessons Learned</h4>
      <ul>
        <li>Versioning is critical - keep protocol versions backward compatible</li>
        <li>Document the plugin lifecycle carefully</li>
        <li>Use feature flags for gradual rollout</li>
        <li>Monitor plugin loading performance</li>
      </ul>
    `
  },
  4: {
    title: 'Mastering Core Data migrations without losing production data',
    date: 'Feb 22, 2026',
    readTime: '10 min read',
    tags: ['Core Data', 'Database', 'Best Practices'],
    content: `
      <h3>The Nightmare Scenario</h3>
      <p>A user has been using your app for 2 years. They've accumulated thousands of local records. You deploy a Core Data schema change, and suddenly their app crashes on launch with "couldn't find model". Or worse, all their data vanishes silently.</p>

      <h4>Understanding Core Data Migrations</h4>
      <p>Core Data migrations come in two flavors: lightweight (automatic) and heavyweight (custom).</p>

      <h4>Safe Migration Strategy</h4>
      <p><strong>1. Version Your Models:</strong></p>
      <p>Always create a new model version when making schema changes. Never modify the current version directly.</p>

      <p><strong>2. Test Extensively:</strong></p>
      <p>Create unit tests to verify migrations don't lose data.</p>

      <h4>Tools & Monitoring</h4>
      <ul>
        <li><strong>CoreData Lab:</strong> Debug your migrations visually</li>
        <li><strong>Custom Logging:</strong> Log all migration steps</li>
        <li><strong>Crash Monitoring:</strong> Track migration-related crashes separately</li>
      </ul>
    `
  },
  5: {
    title: 'Getting the most out of Fastlane in a monorepo',
    date: 'Feb 08, 2026',
    readTime: '7 min read',
    tags: ['CI/CD', 'Automation', 'DevOps'],
    content: `
      <h3>The Challenge</h3>
      <p>At Ciklum, we had multiple iOS and Android projects in a single Git monorepo. Fastlane was slowing us down because it was building both projects every time, even if only one changed.</p>

      <h4>Key Takeaways</h4>
      <ul>
        <li>Use environment variables for all secrets</li>
        <li>Implement smart build detection to save CI time</li>
        <li>Parallelize wherever possible</li>
        <li>Monitor and alert on build failures</li>
        <li>Cache aggressively to speed up builds</li>
      </ul>
    `
  }
};

function toggleBlogPost(id) {
  const modal = document.getElementById('blog-modal');
  const post = blogPosts[id];
  const modalBody = document.getElementById('blog-modal-body');
  
  if (!post) return;
  
  let tagsHtml = post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('');
  
  modalBody.innerHTML = `
    <h2 class="blog-modal-title">${post.title}</h2>
    <div class="blog-modal-meta">
      <span><strong>${post.date}</strong></span>
      <span>${post.readTime}</span>
    </div>
    <div style="margin-bottom: 1.5rem;">${tagsHtml}</div>
    <div class="blog-modal-body">${post.content}</div>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBlogPost() {
  const modal = document.getElementById('blog-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeBlogPost();
});

// =====================================
// INITIALIZATION
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initScrollEffects();
  initScrollReveal();
  initContactForm();
  fetchGitHubStats();
});
