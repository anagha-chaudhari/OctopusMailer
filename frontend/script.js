// Navigation and Initialization
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');

            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
            
            if (targetPage === 'analytics') {
                fetchAnalytics();
            }
        });
    });

    initializeDragAndDrop();
    initializeTemplateFiltering();
});

// Drag and Drop functionality
function initializeDragAndDrop() {
    const emailBuilder = document.getElementById('email-builder');
    const blocks = document.querySelectorAll('.email-block');

    blocks.forEach(block => {
        block.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-block'));
            this.style.opacity = '0.5';
        });

        block.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
        });
    });

    emailBuilder.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    emailBuilder.addEventListener('dragleave', function(e) {
        this.classList.remove('drag-over');
    });

    emailBuilder.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        const blockType = e.dataTransfer.getData('text/plain');
        addBlockToBuilder(blockType);
    });
}

function addBlockToBuilder(blockType) {
    const emailBuilder = document.getElementById('email-builder');
    const blockElement = document.createElement('div');
    blockElement.className = 'card email-content-block';
    blockElement.style.margin = '1rem 0';
    blockElement.style.cursor = 'grab';

    let blockContent = '';
    switch (blockType) {
        case 'header':
            blockContent = `
                <div class="editable-block" contenteditable="true">
                    <h1 style="color: #4a90e2; font-size: 2.5rem; font-weight: bold; margin-bottom: 0;">Hi There! 👋</h1>
                    <p style="color: #666; font-size: 1.1rem;">Ready for something awesome?</p>
                </div>`;
            break;
        case 'hero':
            blockContent = `
                <div class="editable-block" contenteditable="true">
                    <h2 style="font-size: 2rem; color: #ff6f61;">✨ A Story, Just for You!</h2>
                    <p style="font-size: 1.1rem; line-height: 1.6;">Forget the usual scroll. This is a special dispatch from our secret headquarters. We've got news that will make your day. Keep reading, we promise it's worth it!</p>
                </div>`;
            break;
        case 'content':
            blockContent = `
                <div class="editable-block" contenteditable="true">
                    <h3 style="font-size: 1.5rem; color: #50e3c2;">💡 The "Aha!" Moment</h3>
                    <p style="font-size: 1rem; line-height: 1.6; border: px solid #50e3c2; padding-left: 10px;">This is where you drop the knowledge bombs. Share a cool tip, a fun fact, or the inside scoop on what you've been building. Make them feel like they're in on a secret!</p>
                </div>`;
            break;
        case 'cta':
            blockContent = `
                <div class="editable-block" contenteditable="true" style="text-align: center;">
                    <p style="color: #666; margin-bottom: 1rem;">Feeling inspired?</p>
                    <a href="#" class="editable-link" style="display:inline-block; padding:12px 24px; background-color:#7b68ee; color:white; text-decoration:none; border-radius:30px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Yes, Tell Me More! 🚀</a>
                </div>`;
            break;
        case 'footer':
            blockContent = `
                <div class="editable-block" contenteditable="true" style="text-align: center;">
                    <p style="font-size: 0.9rem; color: #999;">Made with ❤️ and code.</p>
                    <p style="font-size: 0.8rem; color: #aaa;">Not your cup of tea? <a href="#" class="editable-link" style="color: #aaa;">No hard feelings, unsubscribe.</a></p>
                </div>`;
            break;
    }

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-block-btn';
    removeButton.textContent = '✖';
    removeButton.style.cssText = 'position: absolute; top: 5px; right: 5px; background: rgba(0, 0, 0, 0.5); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; display: none;';
    removeButton.onclick = function() { removeBlock(this); };

    blockElement.addEventListener('mouseenter', () => removeButton.style.display = 'block');
    blockElement.addEventListener('mouseleave', () => removeButton.style.display = 'none');
    
    blockElement.innerHTML += blockContent;
    blockElement.appendChild(removeButton);

    // Event listener for image upload buttons
    blockElement.querySelectorAll('.image-upload-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.previousElementSibling;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(r) {
                        img.src = r.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    });

    // Event listener for editable links
    blockElement.querySelectorAll('.editable-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newHref = prompt("Enter a new link URL:", link.href);
            if (newHref && newHref !== null) {
                link.href = newHref;
            }
        });
    });

    if (emailBuilder.children.length === 1 && emailBuilder.children[0].tagName === 'P') {
        emailBuilder.innerHTML = '';
    }

    emailBuilder.appendChild(blockElement);
    blockElement.classList.add('success-animation');
}

// removeBlock function remains the same
function removeBlock(button) {
    const block = button.closest('.card');
    block.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        block.remove();
        const emailBuilder = document.getElementById('email-builder');
        if (emailBuilder.children.length === 0) {
            emailBuilder.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Drag email blocks here to build your campaign</p>';
        }
    }, 300);
}

// Email sending functionality
function loadSampleRecipients() {
    const recipientCount = document.getElementById('recipient-count');
    recipientCount.textContent = '✅ Loaded 1,247 recipients from sample database';
    recipientCount.style.color = 'var(--accent-orange)';
}

function previewEmail() {
    alert('🔍 Email preview would open in a new window');
}

function sendEmail() {
    const sendBtn = document.getElementById('send-btn');
    const sendText = document.getElementById('send-text');
    const sendLoading = document.getElementById('send-loading');
    sendText.style.display = 'none';
    sendLoading.style.display = 'inline-block';
    sendBtn.disabled = true;

    const campaignName = document.getElementById('campaign-name').value;
    const subjectLine = document.getElementById('subject-line').value;
    const customMessage = document.getElementById('custom-message').value;

    let recipients = window.uploadedRecipients || ["demo@example.com"];

    const emailBuilder = document.getElementById('email-builder');
    let emailHTML = Array.from(emailBuilder.querySelectorAll('.editable-block'))
        .map(block => block.innerHTML)
        .join('');

    const payload = {
        campaignName,
        subjectLine,
        customMessage,
        recipients,
        emailHTML
    };

    fetch('http://localhost:5000/api/send_campaign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            sendText.style.display = 'inline';
            sendLoading.style.display = 'none';
            if (data.success) {
                sendText.textContent = '✅ Campaign Sent!';
                sendBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                sendBtn.classList.add('success-animation');
            } else {
                sendText.textContent = '❌ Failed to Send';
                sendBtn.style.background = 'linear-gradient(135deg, #dc3545, #ff7675)';
            }
            setTimeout(() => {
                sendText.textContent = 'Send Campaign';
                sendBtn.style.background = '';
                sendBtn.disabled = false;
            }, 3000);
        })
        .catch(err => {
            sendText.style.display = 'inline';
            sendLoading.style.display = 'none';
            sendText.textContent = '❌ Error Sending';
            sendBtn.style.background = 'linear-gradient(135deg, #dc3545, #ff7675)';
            console.error('Error:', err);
            setTimeout(() => {
                sendText.textContent = 'Send Campaign';
                sendBtn.style.background = '';
                sendBtn.disabled = false;
            }, 3000);
        });
}

// Template filtering
function initializeTemplateFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            templateCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function useTemplate(templateType) {
    alert(`🎨 Loading ${templateType} template into email composer...`);

    document.querySelector('[data-page="email-sender"]').click();

    setTimeout(() => {
        const emailBuilder = document.getElementById('email-builder');
        emailBuilder.innerHTML = '';

        addBlockToBuilder('header');
        setTimeout(() => addBlockToBuilder('hero'), 200);
        setTimeout(() => addBlockToBuilder('content'), 400);
        setTimeout(() => addBlockToBuilder('cta'), 600);
        setTimeout(() => addBlockToBuilder('footer'), 800);
    }, 500);
}

function generateAITemplate() {
    const generateBtn = document.getElementById('generate-btn');
    const generateText = document.getElementById('generate-text');
    const generateLoading = document.getElementById('generate-loading');
    const prompt = document.getElementById('ai-prompt').value;

    if (!prompt) {
        alert('Please enter a description for your template!');
        return;
    }

    generateText.style.display = 'none';
    generateLoading.style.display = 'inline-block';
    generateBtn.disabled = true;

    setTimeout(() => {
        generateText.style.display = 'inline';
        generateLoading.style.display = 'none';
        generateText.textContent = '✨ Template Generated!';
        generateBtn.classList.add('success-animation');

        alert(`🤖 AI has generated a custom template based on: "${prompt}"\n\nTemplate added to your library!`);

        setTimeout(() => {
            generateText.textContent = 'Generate with AI';
            generateBtn.disabled = false;
            document.getElementById('ai-prompt').value = '';
        }, 3000);
    }, 3000);
}

// Analytics animations
function animateMetrics(data) {
    if (!data) return;

    const metrics = [
        { id: 'emails-sent', target: data.total_emails_sent, suffix: '' },
        { id: 'open-rate', target: data.open_rate, suffix: '%' },
        { id: 'click-rate', target: data.click_rate, suffix: '%' }
    ];

    metrics.forEach((metric, index) => {
        setTimeout(() => {
            animateCounter(metric.id, metric.target, metric.suffix);
        }, index * 500);
    });
}

function animateCounter(elementId, target, suffix) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;

    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutQuart(progress);
        const currentValue = startValue + (target - startValue) * easeProgress;

        if (suffix === '%') {
            element.textContent = currentValue.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    updateCounter();
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(style);

// File upload handling
document.getElementById('csv-upload')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const recipientCount = document.getElementById('recipient-count');
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            const emails = content.trim().split('\n').filter(email => email);
            window.uploadedRecipients = emails;
            recipientCount.textContent = `📁 Loaded ${emails.length.toLocaleString()} recipients from ${file.name}`;
            recipientCount.style.color = 'var(--accent-orange)';
        };
        reader.readAsText(file);
    }
});

// Add some interactive hover effects
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * 5;
            const rotateY = (centerX - x) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        } else {
            card.style.transform = '';
        }
    });
});

// Analytics endpoint
function fetchAnalytics() {
    fetch('http://localhost:5000/api/analytics')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                animateMetrics(data);
                const recentCampaignsContainer = document.querySelector('.card:nth-of-type(2) > div');
                if (recentCampaignsContainer) {
                    recentCampaignsContainer.innerHTML = '';
                    data.recent_campaigns.forEach(campaign => {
                        const campaignDiv = document.createElement('div');
                        campaignDiv.style.display = 'flex';
                        campaignDiv.style.justifyContent = 'space-between';
                        campaignDiv.style.padding = '1rem 0';
                        campaignDiv.style.borderBottom = '1px solid var(--border-soft)';

                        campaignDiv.innerHTML = `
                            <div>
                                <div style="font-weight: 500;">${campaign.name}</div>
                                <div style="color: var(--text-secondary); font-size: 0.9rem;">Sent ${campaign.sent_at}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="color: var(--accent-orange); font-weight: 500;">${campaign.open_rate}%</div>
                                <div style="color: var(--text-secondary); font-size: 0.9rem;">Open rate</div>
                            </div>
                        `;
                        recentCampaignsContainer.appendChild(campaignDiv);
                    });
                    if (recentCampaignsContainer.lastChild) {
                        recentCampaignsContainer.lastChild.style.borderBottom = 'none';
                    }
                }
            }
        })
        .catch(error => {
            console.error('Failed to fetch analytics:', error);
            document.getElementById('emails-sent').textContent = 'Error';
            document.getElementById('open-rate').textContent = 'Error';
            document.getElementById('click-rate').textContent = 'Error';
        });
}