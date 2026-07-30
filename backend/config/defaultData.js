const bcrypt = require('bcryptjs');

async function getSeedData() {
  const hashedPassword = await bcrypt.hash('123', 10);

  const users = [
    {
      name: 'Mani (SAP Admin)',
      email: 'mani@gmail.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'SAP System Admin',
      email: 'admin@sap.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Mani (Learner User)',
      email: 'user@sap.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const folders = [
    {
      title: '📁 Day 1 – SAP Introduction',
      dayNumber: 1,
      description: 'Overview of Enterprise Resource Planning, SAP S/4HANA architecture, and core modules.',
      order: 1
    },
    {
      title: '📁 Day 2 – SAP GUI',
      dayNumber: 2,
      description: 'SAP Graphical User Interface login, system layout, command field, and user options.',
      order: 2
    },
    {
      title: '📁 Day 3 – Navigation',
      dayNumber: 3,
      description: 'Navigating using Transaction Codes (T-Codes), session management, and favorites menu.',
      order: 3
    },
    {
      title: '📁 Day 4 – Master Data',
      dayNumber: 4,
      description: 'Master Data concepts in SAP MM and SD. Creating materials using MM01 and Customer Master using XK01.',
      order: 4
    },
    {
      title: '📁 Day 5 – Organizational Structure',
      dayNumber: 5,
      description: 'Enterprise structure definitions: Company Code, Plant, Storage Location, Sales Organization, and Purchasing Org.',
      order: 5
    }
  ];

  return { users, folders };
}

const getSeedNotes = (folderMap) => [
  {
    title: 'SAP S/4HANA Architecture & Enterprise Overview',
    description: 'Deep dive into 3-tier architecture, In-Memory DB, Fiori UX, and core business process integration.',
    content: `<h2>1. SAP Architecture Overview</h2><p>SAP (Systems, Applications, and Products in Data Processing) uses a <strong>3-tier client-server architecture</strong> consisting of:</p><ul><li><strong>Presentation Layer:</strong> SAP GUI / SAP Fiori Horizon Launchpad</li><li><strong>Application Layer:</strong> NetWeaver Application Server ABAP</li><li><strong>Database Layer:</strong> SAP HANA In-Memory Database</li></ul><h3>Core Modules</h3><p>Integrates <strong>MM</strong> (Materials Management), <strong>SD</strong> (Sales and Distribution), <strong>FICO</strong> (Financial Accounting & Controlling), and <strong>ABAP</strong> (Advanced Business Application Programming).</p>`,
    folderTitle: '📁 Day 1 – SAP Introduction',
    tags: ['Architecture', 'S4HANA', 'Overview', 'Fiori'],
    sapModule: 'GENERAL',
    author: 'Mani (SAP Admin)',
    isPinned: true,
    isFavorite: true
  },
  {
    title: 'SAP GUI Layout, Shortcuts & Session Tricks',
    description: 'Essential keyboard shortcuts, menu navigation, multi-session management, and personalizing SAP GUI themes.',
    content: `<h2>2. SAP GUI Screen Elements</h2><p>The SAP GUI interface consists of:</p><ol><li><strong>Menu Bar:</strong> Dynamic contextual actions</li><li><strong>Command Field:</strong> Enter T-Codes like <code>/n</code>, <code>/o</code>, <code>SU01</code></li><li><strong>Standard Toolbar:</strong> Save, Back, Exit, Cancel, Print, Find</li><li><strong>Title Bar:</strong> Shows current transaction title</li><li><strong>Status Bar:</strong> Displays system messages (Success, Warning, Error) and transaction details</li></ol><p><strong>Useful Command Field Shortcuts:</strong></p><ul><li><code>/nXXXX</code> - Open T-Code XXXX in current session</li><li><code>/oXXXX</code> - Open T-Code XXXX in NEW session</li><li><code>/i</code> - Close current session</li><li><code>/nend</code> - Log off system safely</li></ul>`,
    folderTitle: '📁 Day 2 – SAP GUI',
    tags: ['SAPGUI', 'Shortcuts', 'BASIS'],
    sapModule: 'BASIS',
    author: 'BASIS Admin',
    isPinned: true,
    isFavorite: false
  },
  {
    title: 'Mastering Transaction Codes & System Diagnostics',
    description: 'Comprehensive guide to running transaction codes, system logs (SM21), background jobs (SM37), and dump analysis (ST22).',
    content: `<h2>3. Useful Diagnostic T-Codes</h2><p>Admin and ABAP developers rely on key transaction codes for system health monitoring:</p><ul><li><code>SE16N</code> - General Table Display (Fast table query)</li><li><code>SM37</code> - Overview of background jobs</li><li><code>ST22</code> - ABAP Runtime Errors / Dump Analysis</li><li><code>AL11</code> - Display SAP Application Server Directories</li><li><code>ST05</code> - Performance Trace (SQL, RFC, Enqueue)</li></ul><p>Example table query: Inspect material table <code>MARA</code> or accounting document header <code>BKPF</code>.</p>`,
    folderTitle: '📁 Day 3 – Navigation',
    tags: ['T-Codes', 'Diagnostics', 'ST22', 'SM37'],
    sapModule: 'GENERAL',
    author: 'Senior ABAP Consultant',
    isPinned: false,
    isFavorite: true
  },
  {
    title: 'SAP MM Material Master Creation via T-Code MM01',
    description: 'Step-by-step tutorial for creating raw materials, finished goods, and maintenance views in SAP MM.',
    content: `<h2>4. Material Master (MM01) Step-by-Step Guide</h2><p>Material Master stores information on all materials that a company procures, manufactures, and stores.</p><h3>Key Execution Steps:</h3><ol><li>Execute transaction code <code>MM01</code>.</li><li>Select <strong>Industry Sector</strong> (e.g. Mechanical Engineering) and <strong>Material Type</strong> (e.g. ROH for Raw Material or FERT for Finished Product).</li><li>Select required views: <em>Basic Data 1</em>, <em>Purchasing</em>, <em>Plant Data / Storage 1</em>, and <em>Accounting 1</em>.</li><li>Enter Plant (e.g. 1000) and Storage Location (e.g. 0001).</li><li>Maintain Base Unit of Measure (e.g. PC or KG) and Material Group.</li></ol><h3>Database Table Mapping:</h3><p>Header data is stored in table <code>MARA</code>, plant data in <code>MARC</code>, and material descriptions in <code>MAKT</code>.</p>`,
    folderTitle: '📁 Day 4 – Master Data',
    tags: ['MM01', 'MARA', 'MaterialMaster', 'MM'],
    sapModule: 'MM',
    author: 'SAP MM Lead',
    isPinned: true,
    isFavorite: true
  },
  {
    title: 'SAP SD Sales Order Processing via VA01 & Shipping Overview',
    description: 'Complete walkthrough of Order-to-Cash (O2C) cycle: Sales Order creation (VA01), Outbound Delivery (VL01N), and Billing (VF01).',
    content: `<h2>5. Sales Order Entry (VA01)</h2><p>The Sales Order is a contract between customer and sales organization for supplying goods or services.</p><h3>Process Steps:</h3><ul><li>Run transaction code <code>VA01</code>.</li><li>Enter <strong>Order Type</strong> (e.g., OR for Standard Order), Sales Organization (1000), Distribution Channel (10), and Division (00).</li><li>Specify Sold-to Party (Customer ID) and Purchase Order (PO) Number.</li><li>Enter Item Material number and Required Quantity.</li><li>Check pricing condition and Availability Check (ATP).</li></ul><p>Data stored in tables <code>VBAK</code> (Sales Order Header) and <code>VBAP</code> (Sales Order Items).</p>`,
    folderTitle: '📁 Day 5 – Organizational Structure',
    tags: ['VA01', 'VBAK', 'VBAP', 'SD', 'O2C'],
    sapModule: 'SD',
    author: 'SAP SD Consultant',
    isPinned: false,
    isFavorite: false
  },
  {
    title: 'ABAP Fundamentals: Data Dictionary SE11 & Code Editor SE38',
    description: 'Introduction to ABAP programming, OPEN SQL queries, internal tables, and BAPI execution.',
    content: `<h2>6. ABAP Open SQL Query Example</h2><p>In ABAP 7.4+ syntax, developers use inline declarations to query SAP database tables:</p><pre><code>DATA: lt_mara TYPE TABLE OF mara.

SELECT matnr, mtart, matkl, meins
  FROM mara
  INTO TABLE @DATA(lt_materials)
  WHERE mtart = 'ROH'.

IF sy-subrc = 0.
  LOOP AT lt_materials ASSIGNING FIELD-SYMBOL(&lt;fs_mat&gt;).
    WRITE: / &lt;fs_mat&gt;-matnr, &lt;fs_mat&gt;-mtart.
  ENDLOOP.
ENDIF.</code></pre><p>Useful T-Codes: <code>SE11</code> for Data Dictionary and <code>SE38</code> for ABAP Editor.</p>`,
    folderTitle: '📁 Day 5 – Organizational Structure',
    tags: ['ABAP', 'SE38', 'SE11', 'SQL', 'BAPI'],
    sapModule: 'ABAP',
    author: 'Senior ABAP Developer',
    isPinned: true,
    isFavorite: true
  }
];

module.exports = {
  getSeedData,
  getSeedNotes
};
