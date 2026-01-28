document.addEventListener('DOMContentLoaded', () => {
    const resultForm = document.getElementById('resultForm');
    const marksObtained = document.getElementById('marksObtained');
    const totalMarks = document.getElementById('totalMarks');
    const gradeDisplay = document.getElementById('gradeDisplay');
    const resultsList = document.getElementById('resultsList');
    const tableSearch = document.getElementById('tableSearch');
    const recordCount = document.getElementById('recordCount');
    const menuToggle = document.getElementById('menuToggle');
    const wrapper = document.getElementById('wrapper');

    let results = [
        { id: 1, rollNo: '1021', name: 'Zohaib Khan', subject: 'Computer Science', marks: 85, total: 100, grade: 'A', status: 'Pass' },
        { id: 2, rollNo: '1022', name: 'Sara Ahmed', subject: 'Mathematics', marks: 42, total: 100, grade: 'D', status: 'Pass' },
        { id: 3, rollNo: '1023', name: 'Ali Raza', subject: 'Physics', marks: 28, total: 100, grade: 'F', status: 'Fail' }
    ];

    // Navigation Logic
    const navItems = {
        'nav-dashboard': { section: 'section-dashboard', title: 'Dashboard Overview' },
        'nav-upload': { section: 'section-upload', title: 'Result Management' },
        'nav-students': { section: 'section-students', title: 'Student Management' },
        'nav-subjects': { section: 'section-subjects', title: 'Course Management' },
        'nav-settings': { section: 'section-settings', title: 'System Settings' }
    };

    Object.keys(navItems).forEach(id => {
        document.getElementById(id).addEventListener('click', (e) => {
            e.preventDefault();

            // Update Active Nav Link
            document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active-nav'));
            document.getElementById(id).classList.add('active-nav');

            // Update Page Title
            document.getElementById('page-title').innerText = navItems[id].title;

            // Show Correct Section
            document.querySelectorAll('.content-section').forEach(section => section.classList.add('d-none'));
            document.getElementById(navItems[id].section).classList.remove('d-none');

            // Close sidebar on mobile
            if (window.innerWidth < 768) {
                wrapper.classList.remove('toggled');
            }
        });
    });

    // Toggle Sidebar
    menuToggle.addEventListener('click', e => {
        e.preventDefault();
        wrapper.classList.toggle('toggled');
    });

    // Auto Calculate Grade
    const calculateGrade = () => {
        const marks = parseFloat(marksObtained.value);
        const total = parseFloat(totalMarks.value);

        if (!isNaN(marks) && !isNaN(total) && total > 0) {
            const percentage = (marks / total) * 100;
            let grade = 'F';
            let status = 'Fail';

            if (percentage >= 80) grade = 'A+';
            else if (percentage >= 70) grade = 'A';
            else if (percentage >= 60) grade = 'B';
            else if (percentage >= 50) grade = 'C';
            else if (percentage >= 40) grade = 'D';

            if (percentage >= 40) status = 'Pass';

            gradeDisplay.innerHTML = `Grade: <span class="${status === 'Pass' ? 'text-success' : 'text-danger'}">${grade}</span> | Status: <span class="${status === 'Pass' ? 'text-success' : 'text-danger'}">${status}</span>`;
            return { grade, status };
        } else {
            gradeDisplay.innerHTML = 'Grade: -- | Status: --';
            return null;
        }
    };

    marksObtained.addEventListener('input', calculateGrade);
    totalMarks.addEventListener('input', calculateGrade);

    // Render Table
    const renderTable = (data = results) => {
        resultsList.innerHTML = '';
        data.forEach(result => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="ps-4 fw-medium text-dark">${result.rollNo}</td>
                <td>${result.name}</td>
                <td>${result.subject}</td>
                <td><span class="fw-bold">${result.marks}</span>/${result.total}</td>
                <td><span class="badge bg-light text-dark border">${result.grade}</span></td>
                <td><span class="badge-status ${result.status === 'Pass' ? 'status-pass' : 'status-fail'}">${result.status}</span></td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editResult(${result.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteResult(${result.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            resultsList.appendChild(tr);
        });
        recordCount.innerText = data.length;
    };

    // Form Submission
    resultForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const calc = calculateGrade();
        if (!calc) return;

        const newResult = {
            id: Date.now(),
            rollNo: document.getElementById('rollNo').value,
            name: document.getElementById('studentName').value,
            subject: document.getElementById('subject').value,
            marks: marksObtained.value,
            total: totalMarks.value,
            grade: calc.grade,
            status: calc.status
        };

        results.unshift(newResult);
        renderTable();
        resultForm.reset();
        gradeDisplay.innerHTML = 'Grade: -- | Status: --';
        showToast('Result uploaded successfully!', 'success');
    });

    // Search Functionality
    tableSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = results.filter(r =>
            r.name.toLowerCase().includes(term) ||
            r.rollNo.toLowerCase().includes(term) ||
            r.subject.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });

    // Global Action Functions
    window.deleteResult = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            results = results.filter(r => r.id !== id);
            renderTable();
            showToast('Record deleted.', 'danger');
        }
    };

    window.editResult = (id) => {
        const item = results.find(r => r.id === id);
        if (item) {
            document.getElementById('rollNo').value = item.rollNo;
            document.getElementById('studentName').value = item.name;
            document.getElementById('subject').value = item.subject;
            marksObtained.value = item.marks;
            totalMarks.value = item.total;
            calculateGrade();
            // Scroll to form
            resultForm.scrollIntoView({ behavior: 'smooth' });
            showToast('Record loaded into form.', 'info');
        }
    };

    // Toast Helper
    const showToast = (message, type = 'success') => {
        const toastEl = document.getElementById('liveToast');
        const toastMsg = document.getElementById('toastMessage');
        const toast = new bootstrap.Toast(toastEl);

        toastEl.className = `toast border-0 shadow bg-${type} text-white`;
        toastMsg.innerText = message;
        toast.show();
    };

    // Initial Render
    renderTable();

    // UI Dropzone Emulation
    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('click', () => document.getElementById('bulkFile').click());
});
