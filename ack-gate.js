/* ============================================================================
   NJTC PORTAL - DAILY ACKNOWLEDGEMENT GATE
   Captures Tutor ID once + daily responsibilities acknowledgement
   ============================================================================ */

const DEBUG = false;
const FORM_ACTION_URL = "PASTE_GOOGLE_FORM_formResponse_URL_HERE"; // YOU MUST UPDATE THIS

// Google Form entry IDs
const ENTRY_DECISION = "entry.994385786";
const ENTRY_SITE = "entry.1171332303";
const ENTRY_SIGNATURE = "entry.1154443602";

// LocalStorage keys
const UID_KEY = "NJTC_UID";

// Get today's date in YYYY-MM-DD format (local timezone)
function getTodayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Initialize on page load
function init() {
    if (DEBUG) console.log('🚀 NJTC Acknowledgement Gate Initializing...');
    
    // Check if we have a Tutor ID
    let uid = localStorage.getItem(UID_KEY);
    
    if (!uid || uid.trim().length < 3) {
        showUIDModal();
    } else {
        checkDailyAcknowledgement(uid);
    }
}

// Show Tutor ID capture modal (ONE TIME ONLY)
function showUIDModal() {
    const modal = document.createElement('div');
    modal.id = 'njtc-uid-modal';
    modal.className = 'njtc-modal-overlay';
    modal.innerHTML = `
        <div class="njtc-modal-content njtc-modal-small">
            <div class="njtc-modal-header">
                <h2>Welcome to NJTC Portal</h2>
            </div>
            <div class="njtc-modal-body">
                <p class="uid-instruction">Please enter your NJTC Tutor ID to continue.</p>
                <input 
                    type="text" 
                    id="uid-input" 
                    class="njtc-input" 
                    placeholder="e.g., T12345"
                    required
                    autocomplete="off"
                />
                <p class="uid-note">This will only be asked once per device.</p>
                <button id="uid-save-btn" class="njtc-btn njtc-btn-primary">
                    Save & Continue
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = document.getElementById('uid-input');
    const saveBtn = document.getElementById('uid-save-btn');
    
    input.focus();
    
    // Handle save
    saveBtn.addEventListener('click', () => {
        const uid = input.value.trim();
        if (uid.length < 3) {
            alert('Please enter a valid Tutor ID (at least 3 characters)');
            input.focus();
            return;
        }
        
        localStorage.setItem(UID_KEY, uid);
        if (DEBUG) console.log('✅ UID saved:', uid);
        
        modal.remove();
        checkDailyAcknowledgement(uid);
    });
    
    // Enter key support
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });
}

// Check if daily acknowledgement is needed
function checkDailyAcknowledgement(uid) {
    const todayKey = getTodayKey();
    const dayKey = `NJTC_ACK_${uid}_${todayKey}`;
    const status = localStorage.getItem(dayKey);
    
    if (DEBUG) console.log('Checking acknowledgement:', { uid, todayKey, dayKey, status });
    
    if (status === 'agree') {
        // Already acknowledged today - allow portal access
        if (DEBUG) console.log('✅ Already acknowledged today');
        return;
    }
    
    if (status === 'decline') {
        // User declined today - show locked message
        showLockedMessage();
        return;
    }
    
    // Need to show acknowledgement modal
    showAcknowledgementModal(uid, dayKey);
}

// Show acknowledgement modal with responsibilities
function showAcknowledgementModal(uid, dayKey) {
    const modal = document.createElement('div');
    modal.id = 'njtc-ack-modal';
    modal.className = 'njtc-modal-overlay';
    modal.innerHTML = `
        <div class="njtc-modal-content njtc-modal-large">
            
            <!-- THIS IS WHERE YOUR RESPONSIBILITIES HTML GOES -->
            <div class="njtc-responsibilities-container">
                <!-- Mission Statement -->
                <div class="responsibilities-header">
                    <h2>Daily On-Site Responsibilities</h2>
                    <p class="mission-statement">
                        Our tutors are entrusted with scholar growth, safety, and instructional continuity. 
                        These responsibilities ensure every session reflects NJTC's standards of care and excellence.
                    </p>
                </div>

                <!-- Expandable Responsibilities Section -->
                <details class="responsibilities-details" open>
                    <summary class="responsibilities-toggle">
                        <span class="toggle-icon">▶</span>
                        <span class="toggle-text">View Complete Responsibilities</span>
                    </summary>
                    
                    <div class="responsibilities-content">
                        
                        <!-- Section 1: On-Site Professionalism -->
                        <section class="responsibility-section">
                            <h3>
                                <span class="section-number">1</span>
                                On-Site Professionalism
                            </h3>
                            <ul>
                                <li>Arrive 5-10 minutes before each scheduled session and maintain 95%+ attendance</li>
                                <li>Notify your Site Coordinator immediately if you will be late or absent</li>
                                <li>Communicate professionally with scholars, colleagues, and school staff at all times</li>
                                <li>Model the positive behavior and academic engagement you expect from scholars</li>
                            </ul>
                        </section>

                        <!-- Section 2: Instructional Responsibilities -->
                        <section class="responsibility-section">
                            <h3>
                                <span class="section-number">2</span>
                                Instructional Responsibilities
                            </h3>
                            <ul>
                                <li>Deliver high-quality, data-driven instruction aligned to i-Ready diagnostic results</li>
                                <li>Follow approved lesson plans using the gradual release model (I do, We do, You do)</li>
                                <li>Implement exit tickets and formative assessments to check for understanding</li>
                                <li>Differentiate instruction to meet individual scholar needs within your tutoring group</li>
                                <li>Prepare all materials and technology before each session begins</li>
                            </ul>
                        </section>

                        <!-- Section 3: Student Safety & Conduct -->
                        <section class="responsibility-section">
                            <h3>
                                <span class="section-number">3</span>
                                Student Safety & Conduct
                            </h3>
                            <ul>
                                <li>Maintain appropriate professional boundaries with scholars at all times</li>
                                <li>Never share personal contact information or connect with scholars on social media</li>
                                <li>Report any safeguarding concerns immediately to your Site Coordinator and Program Management</li>
                                <li>Use positive classroom management strategies; never use negative or punitive language</li>
                                <li>Supervise scholars appropriately throughout the entire session duration</li>
                            </ul>
                        </section>

                        <!-- Section 4: Attendance & Punctuality -->
                        <section class="responsibility-section">
                            <h3>
                                <span class="section-number">4</span>
                                Attendance & Punctuality
                            </h3>
                            <ul>
                                <li>Log scholar attendance in Pearl at the start of each session</li>
                                <li>Complete post-session surveys in Pearl with session notes and scholar observations</li>
                                <li>Maintain 90%+ Pearl completion rate for attendance and surveys</li>
                                <li>Follow up on absent scholars as directed by your Site Coordinator</li>
                            </ul>
                        </section>

                        <!-- Section 5: Communication & Reporting -->
                        <section class="responsibility-section">
                            <h3>
                                <span class="section-number">5</span>
                                Communication & Reporting
                            </h3>
                            <ul>
                                <li>Check your professional Gmail account daily and respond within 24-48 hours</li>
                                <li>Submit lesson plans by the deadline set by your Site Coordinator (typically Friday for the following week)</li>
                                <li>Participate actively in weekly coaching sessions with your Site Coordinator</li>
                                <li>Communicate scholar concerns or wins immediately to classroom teachers and leadership</li>
                                <li>CC your Site Coordinator and Program Management on all relevant communications</li>
                            </ul>
                        </section>

                        <!-- Section 6: Compliance & Ethics -->
                        <section class="responsibility-section">
                            <h3>
                                <span class="section-number">6</span>
                                Compliance & Ethics
                            </h3>
                            <ul>
                                <li>Adhere to all NJTC policies outlined in the Employee Handbook</li>
                                <li>Submit accurate timecards in ADP by payroll deadlines (15th and last day of month)</li>
                                <li>Participate in 100% of required professional development and training sessions</li>
                                <li>Use only approved curriculum materials and resources (i-Ready and Knowtion-approved content)</li>
                                <li>Maintain confidentiality of all scholar data and information</li>
                            </ul>
                        </section>

                    </div>
                </details>

                <!-- Acknowledgement Statement -->
                <div class="acknowledgement-statement">
                    <p>
                        <strong>By selecting "Agree," I acknowledge and commit to upholding these responsibilities during my on-site work today.</strong>
                    </p>
                    <p class="acknowledgement-note">
                        If you have questions about any responsibility, contact your Site Coordinator before proceeding.
                    </p>
                </div>
            </div>
            <!-- END RESPONSIBILITIES HTML -->
            
            <!-- Acknowledgement Form -->
            <div class="njtc-ack-form">
                <div class="form-section">
                    <label class="form-label required">Your Decision</label>
                    <div class="decision-buttons">
                        <button type="button" class="decision-btn decision-agree" data-decision="agree">
                            <span class="decision-icon">✓</span>
                            <span class="decision-text">I Agree</span>
                        </button>
                        <button type="button" class="decision-btn decision-decline" data-decision="decline">
                            <span class="decision-icon">✗</span>
                            <span class="decision-text">I Decline</span>
                        </button>
                    </div>
                    <input type="hidden" id="ack-decision" required />
                </div>

                <div class="form-section">
                    <label for="ack-site" class="form-label required">Site or Location</label>
                    <select id="ack-site" class="njtc-input" required>
                        <option value="">Select your site...</option>
                        <option value="Clifton Middle School">Clifton Middle School</option>
                        <option value="Newark High School">Newark High School</option>
                        <option value="Paterson Elementary School">Paterson Elementary School</option>
                        <option value="Trenton Academy">Trenton Academy</option>
                        <option value="Camden Learning Center">Camden Learning Center</option>
                        <option value="Other">Other (specify below)</option>
                    </select>
                    <input 
                        type="text" 
                        id="ack-site-other" 
                        class="njtc-input" 
                        placeholder="Please specify your site"
                        style="display:none; margin-top: 0.75rem;"
                    />
                </div>

                <div class="form-section">
                    <label for="ack-signature" class="form-label required">Your Signature (Full Name)</label>
                    <input 
                        type="text" 
                        id="ack-signature" 
                        class="njtc-input" 
                        placeholder="Type your full name"
                        required
                        autocomplete="off"
                    />
                </div>

                <div class="form-actions">
                    <button id="ack-submit-btn" class="njtc-btn njtc-btn-primary" disabled>
                        Submit Acknowledgement
                    </button>
                    <button id="ack-change-uid-btn" class="njtc-btn njtc-btn-text">
                        Change Tutor ID
                    </button>
                </div>

                <p class="form-note">
                    Note: We cannot reliably detect submission success due to browser security. 
                    If you experience issues, please refresh and try again.
                </p>
            </div>

        </div>
        
        <!-- Hidden iframe for form submission -->
        <iframe name="njtc_hidden_iframe" style="display:none;"></iframe>
    `;
    
    document.body.appendChild(modal);
    
    // Form interaction logic
    setupAcknowledgementForm(uid, dayKey, modal);
}

// Setup form interactions
function setupAcknowledgementForm(uid, dayKey, modal) {
    const decisionButtons = modal.querySelectorAll('.decision-btn');
    const decisionInput = modal.querySelector('#ack-decision');
    const siteSelect = modal.querySelector('#ack-site');
    const siteOther = modal.querySelector('#ack-site-other');
    const signatureInput = modal.querySelector('#ack-signature');
    const submitBtn = modal.querySelector('#ack-submit-btn');
    const changeUIDBtn = modal.querySelector('#ack-change-uid-btn');
    
    let selectedDecision = null;
    
    // Decision button handling
    decisionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            decisionButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedDecision = btn.dataset.decision;
            decisionInput.value = selectedDecision;
            validateForm();
        });
    });
    
    // Site select handling
    siteSelect.addEventListener('change', () => {
        if (siteSelect.value === 'Other') {
            siteOther.style.display = 'block';
            siteOther.required = true;
        } else {
            siteOther.style.display = 'none';
            siteOther.required = false;
            siteOther.value = '';
        }
        validateForm();
    });
    
    // Signature input
    signatureInput.addEventListener('input', validateForm);
    
    // Form validation
    function validateForm() {
        const hasDecision = !!selectedDecision;
        const hasSite = siteSelect.value && (siteSelect.value !== 'Other' || siteOther.value.trim().length >= 2);
        const hasSignature = signatureInput.value.trim().length >= 3;
        
        submitBtn.disabled = !(hasDecision && hasSite && hasSignature);
    }
    
    // Submit handling
    submitBtn.addEventListener('click', () => {
        const decision = selectedDecision;
        const site = siteSelect.value === 'Other' ? siteOther.value.trim() : siteSelect.value;
        const signature = signatureInput.value.trim();
        
        // Append UID to signature
        const signatureWithUID = `${signature} | UID:${uid}`;
        
        if (DEBUG) {
            console.log('Submitting acknowledgement:', {
                uid,
                decision,
                site,
                signature: signatureWithUID,
                dayKey
            });
        }
        
        // Submit to Google Form
        submitToGoogleForm(decision, site, signatureWithUID, dayKey, modal);
    });
    
    // Change UID handling
    changeUIDBtn.addEventListener('click', () => {
        if (confirm('This will clear your Tutor ID and reload the page. Continue?')) {
            localStorage.removeItem(UID_KEY);
            location.reload();
        }
    });
}

// Submit to Google Form (silent iframe POST)
function submitToGoogleForm(decision, site, signatureWithUID, dayKey, modal) {
    const submitBtn = modal.querySelector('#ack-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Create form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORM_ACTION_URL;
    form.target = 'njtc_hidden_iframe';
    
    // Add fields
    const fields = [
        { name: ENTRY_DECISION, value: decision === 'agree' ? 'Agree' : 'Decline' },
        { name: ENTRY_SITE, value: site },
        { name: ENTRY_SIGNATURE, value: signatureWithUID }
    ];
    
    fields.forEach(field => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field.name;
        input.value = field.value;
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    
    // Wait for submission (no reliable callback due to CORS)
    setTimeout(() => {
        document.body.removeChild(form);
        
        // Store decision
        localStorage.setItem(dayKey, decision);
        
        if (decision === 'agree') {
            // Close modal and allow portal access
            modal.remove();
            if (DEBUG) console.log('✅ Acknowledged - portal access granted');
        } else {
            // Show locked message
            modal.remove();
            showLockedMessage();
        }
    }, 800);
}

// Show locked message for declined acknowledgement
function showLockedMessage() {
    const modal = document.createElement('div');
    modal.id = 'njtc-locked-modal';
    modal.className = 'njtc-modal-overlay';
    modal.innerHTML = `
        <div class="njtc-modal-content njtc-modal-small njtc-modal-locked">
            <div class="njtc-modal-header njtc-header-error">
                <h2>Portal Access Locked</h2>
            </div>
            <div class="njtc-modal-body">
                <div class="locked-icon">🔒</div>
                <p class="locked-message">
                    You declined to acknowledge your daily responsibilities. 
                    Access to the portal is locked for today.
                </p>
                <p class="locked-instruction">
                    Please contact your Site Coordinator or Program Manager if you have questions.
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✅ NJTC Acknowledgement Gate Loaded');
