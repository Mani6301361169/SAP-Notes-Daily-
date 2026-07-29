const { analyzeText } = require('../utils/sapProtectionEngine');
const ActivityLog = require('../models/ActivityLog');

exports.checkGrammar = async (req, res) => {
  try {
    const { text, source } = req.body; // source: 'typing' | 'paste' | 'manual'
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Text input is required for grammar check.' });
    }

    // Strip HTML tags for clean text analysis if rich HTML is passed
    const plainText = text.replace(/<[^>]*>/g, ' ');
    const analysis = analyzeText(plainText);

    if (analysis.suggestions.length > 0 && req.user) {
      await ActivityLog.create({
        action: 'AI Corrections Completed',
        entityType: 'AI',
        entityTitle: 'Grammar & SAP Protection Check',
        user: req.user.name || 'Admin',
        userRole: req.user.role || 'admin',
        details: `Identified ${analysis.suggestions.length} suggestion(s) while protecting SAP terms.`
      });
    }

    return res.json({
      message: 'Grammar and spelling checked successfully.',
      suggestions: analysis.suggestions,
      protectedTermsDetected: analysis.protectedTermsDetected,
      totalIssuesCount: analysis.suggestions.length,
      source: source || 'manual'
    });
  } catch (error) {
    return res.status(500).json({ message: 'AI Grammar check failed', error: error.message });
  }
};
