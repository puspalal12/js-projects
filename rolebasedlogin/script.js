        const users = [
            { username: 'admin', password: 'admin', role: 'ADMIN' },
            { username: 'editor', password: 'editor', role: 'EDITOR' },
            { username: 'user', password: 'user', role: 'USER' }
        ];


        function handleLogin() {
            const userInp = document.getElementById('username').value;
            const passInp = document.getElementById('password').value;

            const user = users.find(u => u.username === userInp && u.password === passInp);

            if (user) {
                localStorage.setItem('session', JSON.stringify(user));
                checkSession();
            } else {
                alert("Invalid Credentials");
            }
        }


        function handleLogout() {
            localStorage.removeItem('session');
            location.reload();
        }


        function checkSession() {
            const session = JSON.parse(localStorage.getItem('session'));
            const loginView = document.getElementById('login-view');
            const dashboardView = document.getElementById('dashboard-view');

            if (session) {

                loginView.classList.add('hidden');
                dashboardView.classList.remove('hidden');

                document.getElementById('display-name').innerText = session.username;
                document.getElementById('display-role').innerText = session.role;


                if (session.role === 'ADMIN') {
                    document.getElementById('admin-section').classList.remove('hidden');
                    document.getElementById('editor-section').classList.remove('hidden');
                } 
                else if (session.role === 'EDITOR') {
                    document.getElementById('editor-section').classList.remove('hidden');
                }

            } else {

                loginView.classList.remove('hidden');
                dashboardView.classList.add('hidden');
            }
        }

        checkSession();
