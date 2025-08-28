document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadPdf');
    
    downloadBtn.addEventListener('click', function() {
        // Add loading state
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            Generating PDF...
        `;

        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Set fonts and margins matching reference PDF
        doc.setFont('helvetica');
        const marginLeft = 15;
        const marginRight = 15;
        const marginTop = 15;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - marginLeft - marginRight;
        let yPosition = marginTop;

        // Helper functions
        const addHorizontalLine = () => {
            doc.setLineWidth(0.5);
            doc.setDrawColor(0, 0, 0);
            doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
            yPosition += 4;
        };

        const addText = (text, fontSize, isBold = false, bottomMargin = 2) => {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, contentWidth);
            doc.text(lines, marginLeft, yPosition);
            yPosition += (lines.length * fontSize * 0.35) + bottomMargin;
            checkPageBreak();
        };

        const addCenteredTitle = (name) => {
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            const textWidth = doc.getStringUnitWidth(name) * 16 / doc.internal.scaleFactor;
            const centerX = (pageWidth - textWidth) / 2;
            doc.text(name, centerX, yPosition);
            yPosition += 8;
        };

        const addContactLine = (info) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const textWidth = doc.getStringUnitWidth(info) * 10 / doc.internal.scaleFactor;
            const centerX = (pageWidth - textWidth) / 2;
            doc.text(info, centerX, yPosition);
            yPosition += 6;
        };

        const addJobHeader = (title, company, location, dates) => {
            doc.setFontSize(10);
            // Job title and company on the left
            doc.setFont('helvetica', 'bold');
            const leftText = `${title}, ${company}`;
            doc.text(leftText, marginLeft, yPosition);
            
            // Location if provided
            if (location) {
                const locationX = marginLeft + doc.getStringUnitWidth(leftText) * 10 / doc.internal.scaleFactor + 3;
                doc.setFont('helvetica', 'normal');
                doc.text(`– ${location}`, locationX, yPosition);
            }
            
            // Dates on the right (italic)
            doc.setFont('helvetica', 'italic');
            const dateWidth = doc.getStringUnitWidth(dates) * 10 / doc.internal.scaleFactor;
            doc.text(dates, pageWidth - marginRight - dateWidth, yPosition);
            yPosition += 5;
            doc.setFont('helvetica', 'normal');
        };

        const addJobDescription = (text) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(text, contentWidth);
            doc.text(lines, marginLeft, yPosition);
            yPosition += (lines.length * 3.5) + 3;
            checkPageBreak();
        };

        const checkPageBreak = () => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = marginTop;
            }
        };

        // Build PDF content matching reference format

        // Name
        addCenteredTitle('Martin');
        
        // Contact info in one line
        addContactLine('Phone: Available on request | Email: atrinmartin@gmail.com | GitHub: github.com/Martin-Atrin | Location: Southeast Asia');
        yPosition += 2;

        // SUMMARY section
        addHorizontalLine();
        addText('SUMMARY', 11, true, 3);
        addText('Expert IT Professional & Hands-on Founder with extensive experience in building and scaling technology ventures. Proven track record in e-commerce, Web3, AI-enhanced development, and community building. Strategic thinker with strong analytical and communication skills, focused on delivering ROI-driven solutions.', 10, false, 4);

        // WORK EXPERIENCE section
        addHorizontalLine();
        addText('WORK EXPERIENCE', 11, true, 4);

        // Job 1 - Polygonface
        addJobHeader('Founder & Tech Lead', 'Polygonface Ltd', 'Remote', '2022 - Present');
        addJobDescription('Leading innovative projects at the intersection of Web2 and Web3 technologies, focusing on community-driven platforms and AI-enhanced software development. Architecting and deploying full-stack applications using modern frameworks (React, Node.js, Next.js, TypeScript). Building decentralized applications and smart contracts for Web3 ecosystems. Leveraging AI tools to accelerate development cycles and enhance code quality. Growing and managing online communities.');
        yPosition += 2;

        // Job 2 - Vianio
        addJobHeader('Hands-on Founder', 'Vianio s.r.o', 'Slovakia', '2016 - 2022');
        addJobDescription('Built and successfully sold an e-commerce business that captured significant market share in Slovakia\'s cosmetics and supplements sectors. Developed custom e-commerce platform using PHP and SQL, handling thousands of transactions. Led strategic planning and logistics optimization, reducing operational costs by 30%. Managed team of 3 across software development, marketing, and operations. Secured B2B partnerships with major retailers and grew B2C channel to €1M+ annual revenue.');
        yPosition += 2;

        // Job 3 - fART studio
        addJobHeader('Narrator / Moderator', 'fART studio s.r.o', 'Slovakia', '2017 - 2020');
        addJobDescription('Commentated on 100+ hours of live poker tournaments for RebuyStars Slovakia. Hosted TV shows for major poker festivals with live audience engagement. Demonstrated quick thinking and professional presence in high-pressure live broadcasts.');
        yPosition += 2;

        // Job 4 - SpadepokerTV
        addJobHeader('Director / Journalist / Reporter', 'SpadepokerTV', 'Slovakia', '2014 - 2017');
        addJobDescription('Directed and produced weekly web news show with 50,000+ viewers. Wrote engaging content covering tournaments, player interviews, and educational material. Built SpadepokerTV into Slovakia\'s premier poker content platform.');
        yPosition += 2;

        // Job 5 - Olympic Casinos
        addJobHeader('Head of Poker Department', 'Olympic Casinos Slovakia', 'Slovakia', '2012 - 2014');
        addJobDescription('Managed 8 floor managers and 50+ dealers across multiple locations. Pioneered web-based live table preview system, first in Slovakia. Increased player traffic by 40% through innovative marketing with zero budget. Opened new premises and established strong player communities. Delivered quarterly performance reports to corporate stakeholders.');
        yPosition += 2;

        // Additional roles
        addJobHeader('Poker Dealer / Floor Manager', 'Various Locations', 'UK/Europe', '2010 - 2018');
        addJobDescription('Worked 1.5 years for PokerStars at the Hippodrome Casino London. Organized poker holidays with PokerTravel.');
        yPosition += 2;

        addJobHeader('Market Penetration Operative', 'Pokerlist Ltd', 'Remote', '');
        addJobDescription('Helped with market penetration of app PokerList displaying poker room data to players.');
        yPosition += 2;

        addJobHeader('Key Account Manager, Product Owner', 'Smartbase s.r.o', 'Slovakia', '');
        addJobDescription('Custom software development for e-commerce sector. Project management and closing deals.');
        yPosition += 2;

        // EDUCATION section
        addHorizontalLine();
        addText('EDUCATION', 11, true, 4);
        addText('Highschool of Transport, Zvolen - Specialized Diploma in Logistics | 2008 - 2011', 10, false, 4);

        // SKILLS section
        addHorizontalLine();
        addText('SKILLS', 11, true, 4);
        addText('Technical: PHP, SQL, JavaScript, React, Node.js, TypeScript, Web3, AI Tools, E-commerce', 10, false, 2);
        addText('Core Competencies: Strategic Thinking, Problem Solving, Communication, Analytical Skills, Industry Knowledge', 10, false, 2);
        addText('Languages: English (C1 Advanced), Slovak (Native)', 10, false, 2);

        // Save the PDF
        doc.save('Martin_Resume.pdf');

        // Reset button state
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
            `;
        }, 500);
    });
    
    // Add animation to skill bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fillBar 1s ease forwards';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.skill-fill').forEach(bar => {
        observer.observe(bar);
    });
});

// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes fillBar {
        from { width: 0; }
        to { width: var(--fill-width); }
    }
    
    .spin {
        animation: spin 1s linear infinite;
        display: inline-block;
    }
`;
document.head.appendChild(style);