const fs = require('fs');

let txt = fs.readFileSync('src/modules/budgets/index.js', 'utf8');

if (!txt.includes('Icons')) {
  txt = txt.replace("import { CATEGORY_MAP }", "import { Icons } from '../../utils/icons.js';\nimport { CATEGORY_MAP }");
}

// Emoticons to Icons map
txt = txt.replace(/'💰'/g, 'Icons.money');
txt = txt.replace(/'✅'/g, 'Icons.success');
txt = txt.replace(/'⚠️'/g, 'Icons.warning');
txt = txt.replace(/'🚨'/g, 'Icons.danger');

// Strings containing emoticons
txt = txt.replace(/✏️ Edit/g, '${Icons.edit} Edit');
txt = txt.replace(/🗑️ Delete/g, '${Icons.delete} Delete');
txt = txt.replace(/💌 Envelope Budgeting/g, '${Icons.envelope} Envelope Budgeting');
txt = txt.replace(/💌 Envelopes/g, '${Icons.envelope} Envelopes');
txt = txt.replace(/📊 Budgets/g, '${Icons.emptyChart} Budgets');
txt = txt.replace(/<div class="empty-illustration">📊<\/div>/g, '<div class="empty-illustration">${Icons.emptyChart}</div>');

txt = txt.replace(/⚠️ You've allocated/g, "${Icons.warning} You've allocated");
txt = txt.replace(/💡 (\$\\{_fmt\\(unallocated\\)\\}) still unallocated/g, "${Icons.lightbulb} $1 still unallocated");
txt = txt.replace(/✅ Income fully allocated!/g, "${Icons.success} Income fully allocated!");

fs.writeFileSync('src/modules/budgets/index.js', txt);
console.log('Done replacement');
