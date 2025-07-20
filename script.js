// Retro Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }, 1500);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add retro typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.classList.contains('typed')) {
        heroTitle.classList.add('typed');
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '3px solid var(--neon-pink)';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Animate skill bars when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillProgress = entry.target.querySelector('.skill-progress');
                if (skillProgress) {
                    const width = skillProgress.style.width;
                    skillProgress.style.width = '0%';
                    setTimeout(() => {
                        skillProgress.style.width = width;
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe skill items
    document.querySelectorAll('.skill-item').forEach(skill => {
        skillObserver.observe(skill);
    });

    // Card hover effects
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add glitch effect to logo on hover
    const logo = document.querySelector('.logo h1');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.5s ease-in-out';
        });
        
        logo.addEventListener('animationend', function() {
            this.style.animation = 'glow 2s ease-in-out infinite alternate';
        });
    }

    // Email obfuscation for bot protection
    function getObfuscatedEmail() {
        // Split email to avoid bot scraping
        const user = 'rahulhalkarni03';
        const domain = 'gmail.com';
        return user + '@' + domain;
    }

    // Setup secure contact form
    const secureForm = document.getElementById('secureContactForm');
    if (secureForm) {
        // Dynamically set form action to avoid exposing email in HTML
        secureForm.action = 'https://formsubmit.co/' + getObfuscatedEmail();
        secureForm.method = 'POST';
        
        // Add hidden fields for FormSubmit configuration
        const hiddenFields = [
            { name: '_next', value: 'https://rahullll101.github.io/contact.html?sent=true' },
            { name: '_subject', value: 'New message from Portfolio!' },
            { name: '_captcha', value: 'false' },
            { name: '_template', value: 'basic' }
        ];
        
        hiddenFields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            secureForm.appendChild(input);
        });
    }

    // Setup secure email link
    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = getObfuscatedEmail();
            this.href = 'mailto:' + email;
            this.textContent = email;
            this.onclick = null; // Remove click handler after first click
            // Trigger the mailto
            window.location.href = 'mailto:' + email;
        });
    }

    // Check if user just submitted a form successfully
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === 'true') {
        showNotification('Message sent successfully! Thank you for contacting me. I\'ll get back to you soon!', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;
            submitBtn.style.background = 'var(--neon-yellow)';
            submitBtn.style.color = 'var(--dark-bg)';
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            try {
                // Method 1: Try Formsubmit.co (completely free, no signup)
                const formsubmitResponse = await fetch('https://formsubmit.co/rahulhalkarni03@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message,
                        _next: window.location.href,
                        _captcha: "false"
                    })
                });

                if (formsubmitResponse.ok) {
                    // Show success message
                    submitBtn.textContent = 'MESSAGE SENT! ✅';
                    submitBtn.style.background = 'var(--neon-green)';
                    submitBtn.style.color = 'var(--dark-bg)';
                    
                    // Reset form
                    this.reset();
                    
                    // Show success notification
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    return;
                }
                
                // Method 2: Fallback to Web3Forms
                const web3Response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: "75cc7ab3-0b24-4ba0-abed-cc1b9d929edc",
                        name: name,
                        email: email,
                        subject: subject,
                        message: message
                    })
                });
                
                const result = await web3Response.json();
                
                if (result.success) {
                    // Show success message
                    submitBtn.textContent = 'MESSAGE SENT! ✅';
                    submitBtn.style.background = 'var(--neon-green)';
                    submitBtn.style.color = 'var(--dark-bg)';
                    
                    // Reset form
                    this.reset();
                    
                    // Show success notification
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                
                // Try backup method (mailto fallback)
                const mailtoLink = `mailto:rahulhalkarni03@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                
                // Show error message
                submitBtn.textContent = 'OPENING EMAIL ✉️';
                submitBtn.style.background = 'var(--neon-blue)';
                submitBtn.style.color = 'var(--dark-bg)';
                
                // Open email client as backup
                window.location.href = mailtoLink;
                
                // Show fallback notification
                showNotification('Opened your email client as backup. Please send the email to complete.', 'info');
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = 'transparent';
                submitBtn.style.color = 'var(--neon-green)';
            }, 3000);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--dark-bg);
            border: 2px solid var(--neon-${type === 'success' ? 'green' : type === 'error' ? 'pink' : 'blue'});
            color: var(--neon-${type === 'success' ? 'green' : type === 'error' ? 'pink' : 'blue'});
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
            max-width: 300px;
            box-shadow: 0 0 20px var(--neon-${type === 'success' ? 'green' : type === 'error' ? 'pink' : 'blue'});
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 12px;
                    cursor: pointer;
                    margin-left: 10px;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Add floating particles effect
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = `var(--neon-${Math.random() > 0.5 ? 'blue' : 'pink'})`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = '0.7';
        particle.style.zIndex = '1';
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        const duration = Math.random() * 3000 + 2000;
        const endY = -10;
        const endX = startX + (Math.random() - 0.5) * 100;
        
        particle.animate([
            { transform: `translate(0, 0)`, opacity: 0 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0.7 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => {
            particle.remove();
        };
    }

    // Create particles periodically
    setInterval(createParticle, 2000);

    // Add navigation active state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Add scroll effect to header
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
});

// Add glitch animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(style);
