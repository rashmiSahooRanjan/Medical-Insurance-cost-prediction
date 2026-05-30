 // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        // Check for saved user preference or use system preference
        if (localStorage.getItem('darkMode') === 'enabled' || 
            (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('darkMode', 'enabled');
                showToast("Dark mode enabled");
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('darkMode', 'disabled');
                showToast("Light mode enabled");
            }
        });
        
        // BMI Calculator
        document.getElementById('calculateBMI').addEventListener('click', () => {
            const heightFt = parseFloat(document.getElementById('height-ft').value) || 0;
            const heightIn = parseFloat(document.getElementById('height-in').value) || 0;
            const weight = parseFloat(document.getElementById('weight').value) || 0;
            
            if (heightFt > 0 && weight > 0) {
                const totalInches = heightFt * 12 + heightIn;
                const bmi = (weight / (totalInches * totalInches)) * 703;
                document.getElementById('bmi').value = bmi.toFixed(1);
                
                // Show toast notification
                showToast("BMI calculated successfully!");
            } else {
                showToast("Please enter valid height and weight", "error");
            }
        });
        
        // Toast notification function
        function showToast(message, type = "success") {
            const toast = document.querySelector('.toast');
            const toastMessage = document.getElementById('toastMessage');
            
            toastMessage.textContent = message;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.className = 'toast hidden';
            }, 3000);
        }
        
        // Accordion functionality
        const accordionBtns = document.querySelectorAll('.accordion-btn');
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('i');
                
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });
        
        // Form submission
        document.getElementById('insuranceForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            document.getElementById('resultsLoading').classList.remove('hidden');
            document.getElementById('initialState').classList.add('hidden');
            document.getElementById('resultsContent').classList.add('hidden');
            
            // Simulate calculation time (in real app, this would be an API call)
            setTimeout(() => {
                document.getElementById('resultsLoading').classList.add('hidden');
                document.getElementById('resultsContent').classList.remove('hidden');
                
                // Initialize chart
                initCostFactorsChart();
                
                // Show success toast
                showToast("Your insurance cost estimate is ready!");
            }, 2000);
        });
        
        // Initialize cost factors chart
        function initCostFactorsChart() {
            const ctx = document.getElementById('costFactorsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Age', 'BMI', 'Smoking', 'Location', 'Deductible'],
                    datasets: [{
                        label: 'Cost Impact (%)',
                        data: [35, 25, 20, 15, 5],
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.7)',
                            'rgba(118, 75, 162, 0.7)',
                            'rgba(234, 102, 102, 0.7)',
                            'rgba(102, 234, 126, 0.7)',
                            'rgba(234, 181, 102, 0.7)'
                        ],
                        borderColor: [
                            'rgba(102, 126, 234, 1)',
                            'rgba(118, 75, 162, 1)',
                            'rgba(234, 102, 102, 1)',
                            'rgba(102, 234, 126, 1)',
                            'rgba(234, 181, 102, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 50,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
        
        // Plan comparison
        document.getElementById('comparePlans').addEventListener('click', function() {
            showToast("Plan comparison feature coming soon!", "info");
            setTimeout(() => {
                window.location.href = "#plans";
            }, 500);
        });
        
        // Save report
        document.getElementById('saveReport').addEventListener('click', function() {
            showToast("Report saved to your account!", "success");
        });
        
        // Language selector
        document.getElementById('languageSelect').addEventListener('change', function() {
            showToast("Language preference saved!", "success");
        });
        
        // Play button for video demo
        document.getElementById('playButton').addEventListener('click', function() {
            showToast("This demo video would play here", "info");
        });
        
        // Initialize with a random annual estimate between $1500-$5000
        window.addEventListener('DOMContentLoaded', () => {
            const randomEstimate = Math.floor(Math.random() * 3500) + 1500;
            document.getElementById('annualEstimate').textContent = randomEstimate.toLocaleString();
        });

