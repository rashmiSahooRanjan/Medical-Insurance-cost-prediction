
   
        // Toggle between Sign In and Sign Up forms
        function toggleForms() {
            const signInForm = document.getElementById('signInForm');
            const signUpForm = document.getElementById('signUpForm');

            if (signInForm.classList.contains('active')) {
                signInForm.classList.remove('active');
                signInForm.classList.add('hidden');
                signUpForm.classList.remove('hidden');
                signUpForm.classList.add('active');
            } else {
                signUpForm.classList.remove('active');
                signUpForm.classList.add('hidden');
                signInForm.classList.remove('hidden');
                signInForm.classList.add('active');
            }

            // Clear all error messages and success messages
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.success-message').forEach(el => el.style.display = 'none');
        }

        // Toggle password visibility
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const icon = input.nextElementSibling;

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        // Email validation
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Handle Sign In
        function handleSignIn() {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const emailError = document.getElementById('loginEmailError');
            const passwordError = document.getElementById('loginPasswordError');
            const successMessage = document.getElementById('signInSuccess');
            const submitBtn = document.querySelector('#signInForm .submit-btn');

            // Reset error messages
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            successMessage.style.display = 'none';

            let isValid = true;

            // Validate email
            if (!email || !isValidEmail(email)) {
                emailError.style.display = 'block';
                isValid = false;
            }

            // Validate password
            if (!password) {
                passwordError.style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Signing In...';

                // Simulate API call
                setTimeout(() => {
                    const existingUser = JSON.parse(localStorage.getItem('HealthInsureUser')) || {};
                    const userData = {
                        email: email,
                        name: existingUser.email === email && existingUser.name ? existingUser.name : 'Valued User',
                        loggedIn: true,
                        loginTime: new Date().toISOString()
                    };

                    // Store to localStorage so Home page can show profile section
                    localStorage.setItem('HealthInsureUser', JSON.stringify(userData));

                    // In a real app, you would validate credentials with a backend
                    // For demo, we'll just save user info and redirect
                    window.userData = userData;

                    // Show success message
                    successMessage.style.display = 'block';
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = 'Sign In';

                    // Redirect to home page after 1 second
                    setTimeout(() => {
                        window.location.href = '../HOME PAGE/Home.html#authSection';
                    }, 1000);
                }, 1000);
            }
        }

        // Handle Sign Up
        function handleSignUp() {
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            const nameError = document.getElementById('signupNameError');
            const emailError = document.getElementById('signupEmailError');
            const passwordError = document.getElementById('signupPasswordError');
            const confirmPasswordError = document.getElementById('signupConfirmPasswordError');
            const successMessage = document.getElementById('signUpSuccess');
            const submitBtn = document.querySelector('#signUpForm .submit-btn');

            // Reset error messages
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            confirmPasswordError.style.display = 'none';
            successMessage.style.display = 'none';

            let isValid = true;

            // Validate name
            if (!name) {
                nameError.style.display = 'block';
                isValid = false;
            }

            // Validate email
            if (!email || !isValidEmail(email)) {
                emailError.style.display = 'block';
                isValid = false;
            }

            // Validate password
            if (!password || password.length < 6) {
                passwordError.style.display = 'block';
                isValid = false;
            }

            // Validate confirm password
            if (password !== confirmPassword) {
                confirmPasswordError.style.display = 'block';
                isValid = false;
            }

            // Check terms agreement
            if (!agreeTerms) {
                alert('Please agree to the Terms & Conditions');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Creating Account...';

                // Simulate API call
                setTimeout(() => {
                    // Store user data
                    const userData = {
                        name: name,
                        email: email,
                        loggedIn: true,
                        signupTime: new Date().toISOString()
                    };

                    localStorage.setItem('HealthInsureUser', JSON.stringify(userData));
                    window.userData = userData;

                    // Show success message
                    successMessage.style.display = 'block';
                    submitBtn.classList.remove('loading');
                    submitBtn.textContent = 'Create Account';

                    // Redirect to home page after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = '../HOME PAGE/Home.html#authSection';
                    }, 1500);
                }, 1000);
            }
        }

        // Handle social login
        function socialLogin(provider) {
            alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would be integrated here. Redirecting to home page for demo...`);
            
            const userData = {
                name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                email: `${provider}@example.com`,
                loggedIn: true,
                socialProvider: provider,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('HealthInsureUser', JSON.stringify(userData));

            // For demo purposes, redirect after social login
            setTimeout(() => {
                window.location.href = '../HOME PAGE/Home.html#authSection';
            }, 1000);
        }

        // Handle Enter key press
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const signInActive = document.getElementById('signInForm').classList.contains('active');
                if (signInActive) {
                    handleSignIn();
                } else {
                    handleSignUp();
                }
            }
        });

        // Clear errors on input
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                const errorElement = this.parentElement.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });
