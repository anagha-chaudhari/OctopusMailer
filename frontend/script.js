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
                    <p style="font-size: 1rem; line-height: 1.6; border: 1px solid #50e3c2; padding-left: 10px;">This is where you drop the knowledge bombs. Share a cool tip, a fun fact, or the inside scoop on what you've been building. Make them feel like they're in on a secret!</p>
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

    // Add editing palette to each editable block (modern Selection/Range API)
    setTimeout(() => {
        blockElement.querySelectorAll('.editable-block').forEach(editable => {
            // Create palette
            const palette = document.createElement('div');
            palette.className = 'editing-palette';
            palette.style.cssText = `
                display: none;
                position: relative;
                margin-bottom: 0.7rem;
                z-index: 10;
                background: linear-gradient(135deg, rgba(255, 175, 189, 0.85) 0%, rgba(255, 195, 113, 0.85) 100%);
                border-radius: 2.2rem 2.2rem 1.2rem 1.2rem / 2.2rem 2.2rem 1.2rem 1.2rem;
                box-shadow: 0 8px 32px rgba(255, 175, 189, 0.18), 0 2px 8px rgba(255, 195, 113, 0.13);
                padding: 0.7rem 1.4rem;
                gap: 1rem;
                align-items: center;
                border: 2px solid rgba(255, 195, 113, 0.35);
                min-width: 240px;
                justify-content: center;
                top: 0;
                left: 0;
                transform: none;
                backdrop-filter: blur(12px);
            `;

            // Add custom styles for palette controls
            const paletteStyle = document.createElement('style');
            paletteStyle.textContent = `
                .editing-palette {
                    display: flex;
                    flex-wrap: wrap;
                    backdrop-filter: blur(12px);
                    box-shadow: 0 8px 32px rgba(255,175,189,0.18), 0 2px 8px rgba(255,195,113,0.13);
                    border-radius: 2.2rem 2.2rem 1.2rem 1.2rem / 2.2rem 2.2rem 1.2rem 1.2rem;
                    border: 2px solid rgba(255,195,113,0.35);
                    background: linear-gradient(135deg, rgba(255, 141, 160, 1) 0%, rgba(255, 196, 113, 1) 100%);
                    min-width: 240px;
                    padding: 0.7rem 1.4rem;
                    gap: 1rem;
                    align-items: center;
                    justify-content: center;
                }
                .editing-palette input[type="color"] {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(255,195,113,0.13);
                    transition: box-shadow 0.2s;
                }
                .editing-palette input[type="color"]:hover {
                    box-shadow: 0 4px 16px rgba(255,175,189,0.23);
                }
                .editing-palette select {
                    font-size: 1.1rem;
                    padding: 0.5rem 1rem;
                    border-radius: 1.2rem;
                    border: 2px solid #ffafbd;
                    background: rgba(255,255,255,0.7);
                    color: #ff6f61;
                    font-family: 'JetBrains Mono', 'Inter', Arial, sans-serif;
                    box-shadow: 0 2px 8px rgba(255,175,189,0.07);
                }
                .editing-palette button {
                    font-size: 1.3rem;
                    padding: 0.5rem 1rem;
                    border-radius: 1.2rem;
                    border: none;
                    background: linear-gradient(135deg, #ff955cff 0%, #ff7e89ff 100%);
                    color: #fff;
                    font-weight: 700;
                    cursor: pointer;
                    transition: box-shadow 0.2s, transform 0.2s;
                    box-shadow: 0 2px 8px rgba(255,175,189,0.07);
                    margin-right: 0.2rem;
                    font-family: 'JetBrains Mono', 'Inter', Arial, sans-serif;
                    border-bottom: 3px solid #1d1d1dff;
                }
                .editing-palette button.active {
                    background: linear-gradient(135deg, #ff955cff 0%, #ff7e89ff 100%);
                    color: #ff6f61;
                    border-bottom: 3px solid #ffafbd;
                }
                .editing-palette button:last-child {
                    margin-right: 0;
                }
                .editing-palette button:hover {
                    box-shadow: 0 8px 32px rgba(255,175,189,0.18);
                    background: linear-gradient(135deg, #8edcdcff 0%, #8fd7a8ff 100%);
                    transform: scale(0.97);
                    border-bottom: none;
                }
            `;
            document.head.appendChild(paletteStyle);

            // Helper to wrap selection in a span with style, or remove style if toggling off
            function styleSelection(styleObj, removeStyleKey = null) {
                const sel = window.getSelection();
                if (!sel.rangeCount) return;
                let range = sel.getRangeAt(0);
                if (!range || !sel.anchorNode || !editable.contains(sel.anchorNode)) return;

                // If selection is collapsed (no text selected), select the word under the cursor
                if (sel.isCollapsed) {
                    const node = sel.anchorNode;
                    if (node && node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent;
                        const offset = sel.anchorOffset;
                        let start = offset, end = offset;
                        while (start > 0 && /\S/.test(text[start - 1])) start--;
                        while (end < text.length && /\S/.test(text[end])) end++;
                        range = document.createRange();
                        range.setStart(node, start);
                        range.setEnd(node, end);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }

                // Remove style if toggling off
                if (!sel.isCollapsed && removeStyleKey) {
                    // Try to unwrap span with the style
                    const contents = range.cloneContents();
                    let found = false;
                    // Only unwrap if the selection is inside a span with the style
                    if (range.startContainer.parentElement && range.startContainer.parentElement.tagName === 'SPAN') {
                        const span = range.startContainer.parentElement;
                        if (span.style[removeStyleKey]) {
                            // Replace span with its children
                            const parent = span.parentNode;
                            while (span.firstChild) parent.insertBefore(span.firstChild, span);
                            parent.removeChild(span);
                            found = true;
                        }
                    }
                    if (found) {
                        sel.removeAllRanges();
                        const newRange = document.createRange();
                        newRange.selectNodeContents(editable);
                        newRange.collapse(false);
                        sel.addRange(newRange);
                        return;
                    }
                }

                // Only style if range has content
                if (!sel.isCollapsed) {
                    const span = document.createElement('span');
                    Object.assign(span.style, styleObj);
                    span.appendChild(range.extractContents());
                    range.insertNode(span);
                    // Move cursor after span
                    sel.removeAllRanges();
                    const newRange = document.createRange();
                    newRange.setStartAfter(span);
                    newRange.collapse(true);
                    sel.addRange(newRange);
                }
            }

            // Font color
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.title = 'Text Color';
            colorInput.style.marginRight = '6px';
            colorInput.oninput = () => {
                styleSelection({ color: colorInput.value });
            };
            palette.appendChild(colorInput);

            // Font family
            const fontSelect = document.createElement('select');
            fontSelect.title = 'Font Family';
            ['Inter', 'Arial', 'JetBrains Mono', 'Georgia', 'Times New Roman', 'Courier New'].forEach(font => {
                const opt = document.createElement('option');
                opt.value = font;
                opt.textContent = font;
                fontSelect.appendChild(opt);
            });
            fontSelect.onchange = () => {
                styleSelection({ fontFamily: fontSelect.value });
            };
            palette.appendChild(fontSelect);

            // Bold (toggle)
            const boldBtn = document.createElement('button');
            boldBtn.type = 'button';
            boldBtn.innerHTML = '<b>B</b>';
            boldBtn.title = 'Bold';
            boldBtn.style.marginRight = '4px';
            boldBtn.onclick = () => {
                const sel = window.getSelection();
                let isActive = false;
                if (sel.rangeCount && sel.anchorNode && editable.contains(sel.anchorNode)) {
                    const node = sel.anchorNode;
                    if (node && node.nodeType === Node.TEXT_NODE) {
                        isActive = node.parentElement && node.parentElement.style.fontWeight === 'bold';
                    } else if (node && node.nodeType === Node.ELEMENT_NODE) {
                        isActive = node.style.fontWeight === 'bold';
                    }
                }
                if (isActive) {
                    styleSelection({}, 'fontWeight');
                } else {
                    styleSelection({ fontWeight: 'bold' });
                }
            };
            palette.appendChild(boldBtn);

            // Italic (toggle)
            const italicBtn = document.createElement('button');
            italicBtn.type = 'button';
            italicBtn.innerHTML = '<i>I</i>';
            italicBtn.title = 'Italic';
            italicBtn.style.marginRight = '4px';
            italicBtn.onclick = () => {
                const sel = window.getSelection();
                let isActive = false;
                if (sel.rangeCount && sel.anchorNode && editable.contains(sel.anchorNode)) {
                    const node = sel.anchorNode;
                    if (node && node.nodeType === Node.TEXT_NODE) {
                        isActive = node.parentElement && node.parentElement.style.fontStyle === 'italic';
                    } else if (node && node.nodeType === Node.ELEMENT_NODE) {
                        isActive = node.style.fontStyle === 'italic';
                    }
                }
                if (isActive) {
                    styleSelection({}, 'fontStyle');
                } else {
                    styleSelection({ fontStyle: 'italic' });
                }
            };
            palette.appendChild(italicBtn);

            // Underline (toggle)
            const underlineBtn = document.createElement('button');
            underlineBtn.type = 'button';
            underlineBtn.innerHTML = '<u>U</u>';
            underlineBtn.title = 'Underline';
            underlineBtn.style.marginRight = '4px';
            underlineBtn.onclick = () => {
                const sel = window.getSelection();
                let isActive = false;
                if (sel.rangeCount && sel.anchorNode && editable.contains(sel.anchorNode)) {
                    const node = sel.anchorNode;
                    if (node && node.nodeType === Node.TEXT_NODE) {
                        isActive = node.parentElement && node.parentElement.style.textDecoration === 'underline';
                    } else if (node && node.nodeType === Node.ELEMENT_NODE) {
                        isActive = node.style.textDecoration === 'underline';
                    }
                }
                if (isActive) {
                    styleSelection({}, 'textDecoration');
                } else {
                    styleSelection({ textDecoration: 'underline' });
                }
            };
            palette.appendChild(underlineBtn);

            // Show/hide palette on focus/blur, mouseover/mouseout
            editable.style.position = 'relative';
            let paletteHovered = false;
            let editableFocused = false;

            function showPalette() {
                palette.style.display = 'flex';
            }
            function hidePalette() {
                if (!paletteHovered && !editableFocused) {
                    palette.style.display = 'none';
                }
            }

            editable.addEventListener('focus', () => {
                editableFocused = true;
                showPalette();
            });
            editable.addEventListener('blur', () => {
                editableFocused = false;
                setTimeout(hidePalette, 150);
            });
            editable.addEventListener('click', () => {
                editableFocused = true;
                showPalette();
            });

            palette.addEventListener('mouseenter', () => {
                paletteHovered = true;
                showPalette();
            });
            palette.addEventListener('mouseleave', () => {
                paletteHovered = false;
                setTimeout(hidePalette, 150);
            });

            // Insert palette above the editable block
            editable.parentElement.insertBefore(palette, editable);
        });
    }, 0);

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
    const emailBuilder = document.getElementById('email-builder');
    const emailHTML = Array.from(emailBuilder.querySelectorAll('.editable-block'))
        .map(block => block.innerHTML)
        .join('');

    // Optionally include the custom message
    const customMessage = document.getElementById('custom-message').value;
    let previewContent = '';
    if (customMessage && customMessage.trim()) {
        previewContent += `<div style="margin-bottom:2rem; color:var(--text-secondary); font-size:1.1rem;">${customMessage}</div>`;
    }
    previewContent += emailHTML;

    // Open in new tab and write the preview HTML
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <title>Email Preview</title>
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' rel='stylesheet'>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f8f9fa; padding: 2rem; color: #222; }
            .email-preview { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 6px; box-shadow: 0 2px 16px rgba(63, 63, 63, 0.07); padding: 2rem; }
        </style>
    </head>
    <body>
        <div class='email-preview'>${previewContent}</div>
    </body>
    </html>`);
    previewWindow.document.close();
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
            sendBtn.disabled = true;
            setTimeout(() => {
                sendText.textContent = 'Send Campaign';
                sendBtn.style.background = '';
                sendBtn.classList.remove('success-animation');
                sendBtn.disabled = false;
            }, 3000);
        } else {
            sendText.textContent = '❌ Failed to Send';
            sendBtn.style.background = 'linear-gradient(135deg, #dc3545, #ff7675)';
            setTimeout(() => {
                sendText.textContent = 'Send Campaign';
                sendBtn.style.background = '';
                sendBtn.disabled = false;
            }, 3000);
        }
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

// ✅ Shared addBlock() function
function addBlock(type, starterHTML) {
    const emailBuilder = document.getElementById('email-builder');
    const blockElement = document.createElement('div');
    blockElement.className = 'card email-content-block';
    blockElement.style.margin = '1rem 0';
    blockElement.style.cursor = 'grab';
    blockElement.innerHTML = `<div class="editable-block" contenteditable="true">${starterHTML}</div>`;
    emailBuilder.appendChild(blockElement);
    blockElement.classList.add('success-animation');

    // Add editing palette
    setTimeout(() => {
        blockElement.querySelectorAll('.editable-block').forEach(editable => {
            const palette = createEditingPalette(editable);
            editable.parentElement.insertBefore(palette, editable);
        });
    }, 0);

    // Special case for CTA links
    if (type === 'cta') {
        setTimeout(() => {
            blockElement.querySelectorAll('.editable-link').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const newHref = prompt('Enter a new link URL:', link.href || 'https://');
                    if (newHref && newHref !== null) {
                        link.href = newHref;
                    }
                });
            });
        }, 0);
    }
}

// ✅ Create editing palette
function createEditingPalette(editable) {
    const palette = document.createElement('div');
    palette.className = 'editing-palette';
    palette.style.cssText = `
        display: none;
        position: relative;
        margin-bottom: 0.7rem;
        z-index: 10;
        background: linear-gradient(135deg, rgba(255, 175, 189, 0.85) 0%, rgba(255, 195, 113, 0.85) 100%);
        border-radius: 2.2rem 2.2rem 1.2rem 1.2rem / 2.2rem 2.2rem 1.2rem 1.2rem;
        box-shadow: 0 8px 32px rgba(255, 175, 189, 0.18), 0 2px 8px rgba(255, 195, 113, 0.13);
        padding: 0.7rem 1.4rem;
        gap: 1rem;
        align-items: center;
        border: 2px solid rgba(255, 195, 113, 0.35);
        min-width: 240px;
        justify-content: center;
        backdrop-filter: blur(12px);
    `;

    function styleSelection(styleObj, removeStyleKey = null) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        let range = sel.getRangeAt(0);
        if (!range || !sel.anchorNode || !editable.contains(sel.anchorNode)) return;

        if (sel.isCollapsed) {
            const node = sel.anchorNode;
            if (node && node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const offset = sel.anchorOffset;
                let start = offset, end = offset;
                while (start > 0 && /\S/.test(text[start - 1])) start--;
                while (end < text.length && /\S/.test(text[end])) end++;
                range = document.createRange();
                range.setStart(node, start);
                range.setEnd(node, end);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        if (!sel.isCollapsed && removeStyleKey) {
            if (range.startContainer.parentElement?.tagName === 'SPAN') {
                const span = range.startContainer.parentElement;
                if (span.style[removeStyleKey]) {
                    const parent = span.parentNode;
                    while (span.firstChild) parent.insertBefore(span.firstChild, span);
                    parent.removeChild(span);
                }
            }
            return;
        }

        if (!sel.isCollapsed) {
            const span = document.createElement('span');
            Object.assign(span.style, styleObj);
            span.appendChild(range.extractContents());
            range.insertNode(span);
            const newRange = document.createRange();
            newRange.setStartAfter(span);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
        }
    }

    // 🎨 Color picker
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.title = 'Text Color';
    colorInput.oninput = () => styleSelection({ color: colorInput.value });
    palette.appendChild(colorInput);

    // 🔠 Font family selector
    const fontSelect = document.createElement('select');
    ['Inter', 'Arial', 'Poppins', 'Georgia', 'Times New Roman', 'Courier New'].forEach(font => {
        const opt = document.createElement('option');
        opt.value = font;
        opt.textContent = font;
        fontSelect.appendChild(opt);
    });
    fontSelect.onchange = () => styleSelection({ fontFamily: fontSelect.value });
    palette.appendChild(fontSelect);

    // Bold, Italic, Underline
    [['B', 'bold', 'fontWeight'], ['I', 'italic', 'fontStyle'], ['U', 'underline', 'textDecoration']].forEach(([label, styleValue, styleKey]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = styleValue === 'italic' ? `<i>${label}</i>` : (styleValue === 'underline' ? `<u>${label}</u>` : `<b>${label}</b>`);
        btn.onclick = () => {
            const sel = window.getSelection();
            let isActive = sel.rangeCount && sel.anchorNode && editable.contains(sel.anchorNode) &&
                sel.anchorNode.parentElement?.style[styleKey] === styleValue;
            if (isActive) styleSelection({}, styleKey);
            else styleSelection({ [styleKey]: styleValue });
        };
        palette.appendChild(btn);
    });

    // Show/hide palette logic
    let paletteHovered = false;
    let editableFocused = false;

    editable.addEventListener('focus', () => { editableFocused = true; palette.style.display = 'flex'; });
    editable.addEventListener('blur', () => { editableFocused = false; setTimeout(() => { if (!paletteHovered) palette.style.display = 'none'; }, 150); });
    editable.addEventListener('click', () => { editableFocused = true; palette.style.display = 'flex'; });

    palette.addEventListener('mouseenter', () => { paletteHovered = true; palette.style.display = 'flex'; });
    palette.addEventListener('mouseleave', () => { paletteHovered = false; setTimeout(() => { if (!editableFocused) palette.style.display = 'none'; }, 150); });

    return palette;
}

// ✅ Pre-made template loader
function useTemplate(templateType) {
    alert(`🎨 Loading ${templateType.replace(/-/g, ' ')} template into email composer...`);
    document.querySelector('[data-page="email-sender"]').click();

    setTimeout(() => {
        const emailBuilder = document.getElementById('email-builder');
        emailBuilder.innerHTML = '';

        switch (templateType) {
            case 'product-launch':
                addBlock('header', `<h1 style='color:#4a90e2;'>Introducing Our Latest Product!</h1><p>We're excited to unveil something special. Discover the features below.</p>`);
                setTimeout(() => addBlock('hero', `<h2 style='color:#ff6f61;'>Meet [Product Name]</h2><p>Designed to solve your biggest challenges. Sleek, smart, and ready for you.</p>`), 200);
                setTimeout(() => addBlock('content', `<h3>Key Features</h3><ul><li>Feature 1</li><li>Feature 2</li></ul>`), 400);
                setTimeout(() => addBlock('cta', `<p>Ready to experience the future?</p><a href='#' class='editable-link' style='color:white;background:#7b68ee;padding:12px 24px;border-radius:30px;'>Shop Now</a>`), 600);
                setTimeout(() => addBlock('footer', `<p>Thank you for being part of our journey!</p>`), 800);
                break;
            default:
                addBlock('header', `<h1 style='color:#4a90e2;'>Welcome!</h1><p>Start building your campaign below.</p>`);
        }
    }, 500);
}

// ✅ AI template generator
async function generateAITemplate() {
    const generateBtn = document.getElementById('generate-btn');
    const generateText = document.getElementById('generate-text');
    const generateLoading = document.getElementById('generate-loading');
    const prompt = document.getElementById('ai-prompt').value.trim();

    if (!prompt) return alert('Please enter a description for your template!');

    generateText.style.display = 'none';
    generateLoading.style.display = 'inline-block';
    generateBtn.disabled = true;

    try {
        // Call your backend route
        const response = await fetch("http://localhost:5000/api/generate-email-template", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        const aiHTML = data.html;

        document.querySelector('[data-page="email-sender"]').click();

        setTimeout(() => {
            const emailBuilder = document.getElementById('email-builder');
            emailBuilder.innerHTML = '';

            const sections = aiHTML.split(/(?:###|---)/g); // split by ### or ---
            sections.forEach(section => {
                if (section.trim()) addBlock('ai', section.trim());
            });

            generateText.style.display = 'inline';
            generateLoading.style.display = 'none';
            generateText.textContent = '✨ Template Generated!';
            generateBtn.classList.add('success-animation');
        }, 500);

    } catch (err) {
        console.error(err);
        alert('❌ Failed to generate template. Please try again.');
    } finally {
        setTimeout(() => {
            generateText.textContent = 'Generate with AI';
            generateBtn.disabled = false;
            document.getElementById('ai-prompt').value = '';
        }, 3000);
    }
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
                // Only update the Recent Campaigns box in the Analytics section
                const analyticsSection = document.getElementById('analytics');
                const recentCampaignsCard = analyticsSection.querySelector('.card:nth-of-type(2)');
                const recentCampaignsContainer = recentCampaignsCard ? recentCampaignsCard.querySelector('div') : null;
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