const fs = require('fs');

// Function to apply task assignment corrections based on audit
function applyTaskCorrections() {
    const corrections = [
        // Kitchen tasks - involve Sunil (Kitchen specialist)
        {
            find: "Kitchen Equipment Vendor",
            replace: "Sunil + Kitchen Equipment Vendor",
            tasks: [
                "Deliver kitchen equipment post-Diwali",
                "Recondition and integrate existing kitchen equipment"
            ]
        },
        
        // Kitchen layout meeting - include Sunil
        {
            find: "Arushi + Vishal + Team",
            replace: "Arushi + Vishal + Sunil + Team",
            tasks: ["Coordinate kitchen equipment layout meeting"]
        },
        
        // Ventilation tasks - involve Pradeep (HVAC & Exhaust)
        {
            find: "Vishal & Bhargav",
            replace: "Pradeep + Vishal",
            tasks: ["Install wall fans for washing area ventilation (2 units)"]
        },
        
        // Electrical tasks - assign to Sandeep if he handles electrical
        {
            find: "Bhargav",
            replace: "Sandeep",
            tasks: ["Install electrical point for terrace signage"]
        }
    ];
    
    return corrections;
}

// Apply corrections to markdown file
function updateMarkdownFile() {
    try {
        let content = fs.readFileSync('./PB Build - Action Items.md', 'utf8');
        const corrections = applyTaskCorrections();
        
        console.log('🔧 Applying task assignment corrections...\n');
        
        corrections.forEach(correction => {
            correction.tasks.forEach(task => {
                const oldPattern = new RegExp(`(${task.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*\\|\\s*${correction.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
                const newReplacement = `$1 | ${correction.replace}`;
                
                if (content.includes(task) && content.includes(correction.find)) {
                    content = content.replace(oldPattern, newReplacement);
                    console.log(`✅ Updated: "${task}"`);
                    console.log(`   From: ${correction.find}`);
                    console.log(`   To: ${correction.replace}\n`);
                }
            });
        });
        
        // Write corrected content to a new file
        fs.writeFileSync('./PB Build - Action Items - CORRECTED.md', content);
        console.log('📁 Corrected file saved as: PB Build - Action Items - CORRECTED.md');
        
        return content;
        
    } catch (error) {
        console.error('Error updating markdown file:', error);
        return null;
    }
}

// Generate correction summary
function generateCorrectionSummary() {
    const corrections = applyTaskCorrections();
    
    console.log('\n📋 TASK ASSIGNMENT CORRECTION SUMMARY:\n');
    console.log('Based on contractor specialties from phone numbers.md:\n');
    
    corrections.forEach((correction, index) => {
        console.log(`${index + 1}. ${correction.tasks.join(', ')}`);
        console.log(`   ❌ Was: ${correction.find}`);
        console.log(`   ✅ Now: ${correction.replace}\n`);
    });
    
    console.log('🎯 KEY IMPROVEMENTS:');
    console.log('• Sunil (Kitchen) now involved in all kitchen equipment tasks');
    console.log('• Pradeep (HVAC) now handles ventilation work');
    console.log('• Sandeep handles electrical tasks');
    console.log('• All specialists properly utilized');
}

module.exports = {
    applyTaskCorrections,
    updateMarkdownFile,
    generateCorrectionSummary
};