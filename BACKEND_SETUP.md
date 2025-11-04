# Backend Setup Guide

This document contains the complete Node.js, Express, and MongoDB backend implementation.

## Folder Structure

```
backend/
├── models/
│   ├── Member.js
│   ├── Group.js
│   ├── Attendance.js
│   └── Report.js
├── controllers/
│   ├── memberController.js
│   ├── groupController.js
│   ├── attendanceController.js
│   └── reportController.js
├── routes/
│   ├── members.js
│   ├── groups.js
│   ├── attendance.js
│   └── reports.js
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
├── config/
│   └── db.js
├── server.js
├── .env.example
└── package.json
```

## Installation

1. Create a new folder called `backend` and navigate to it
2. Initialize the project:
```bash
npm init -y
```

3. Install dependencies:
```bash
npm install express mongoose cors dotenv express-oauth2-jwt-bearer
npm install --save-dev nodemon
```

## File Contents

### package.json

```json
{
  "name": "church-management-backend",
  "version": "1.0.0",
  "description": "Backend API for Church Management System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-oauth2-jwt-bearer": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### .env.example

```env
MONGO_URI=mongodb://localhost:27017/church_management
PORT=5000
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-audience
```

### config/db.js

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### middlewares/auth.js

```javascript
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
});

module.exports = checkJwt;
```

### middlewares/errorHandler.js

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

### models/Member.js

```javascript
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

memberSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Member', memberSchema);
```

### models/Group.js

```javascript
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  leader: {
    type: String,
    trim: true
  },
  meetingTime: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

groupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Group', groupSchema);
```

### models/Attendance.js

```javascript
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'excused'],
    default: 'present'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

attendanceSchema.index({ memberId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
```

### models/Report.js

```javascript
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  reportType: {
    type: String,
    enum: ['attendance', 'membership', 'financial', 'general'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  summary: {
    totalMembers: Number,
    averageAttendance: Number,
    totalServices: Number,
    attendanceRate: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
```

### controllers/memberController.js

```javascript
const Member = require('../models/Member');

// Get all members with pagination, sorting, and search
exports.getAllMembers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const members = await Member.find(query)
      .populate('groupId', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Member.countDocuments(query);

    res.json({
      success: true,
      data: members,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single member
exports.getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id).populate('groupId');
    
    if (!member) {
      const error = new Error('Member not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// Create member
exports.createMember = async (req, res, next) => {
  try {
    const member = await Member.create(req.body);
    
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// Update member
exports.updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      const error = new Error('Member not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// Delete member
exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      const error = new Error('Member not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

### controllers/groupController.js

```javascript
const Group = require('../models/Group');
const Member = require('../models/Member');

// Get all groups with pagination, sorting, and search
exports.getAllGroups = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const groups = await Group.find(query)
      .populate('members', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Group.countDocuments(query);

    res.json({
      success: true,
      data: groups,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single group
exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate('members');
    
    if (!group) {
      const error = new Error('Group not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// Create group
exports.createGroup = async (req, res, next) => {
  try {
    const group = await Group.create(req.body);
    
    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// Update group
exports.updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!group) {
      const error = new Error('Group not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// Delete group
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) {
      const error = new Error('Group not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add member to group
exports.addMemberToGroup = async (req, res, next) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      const error = new Error('Group not found');
      error.statusCode = 404;
      throw error;
    }

    if (!group.members.includes(memberId)) {
      group.members.push(memberId);
      await group.save();

      await Member.findByIdAndUpdate(memberId, { groupId: group._id });
    }

    res.json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};
```

### controllers/attendanceController.js

```javascript
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// Get all attendance records with pagination and filtering
exports.getAllAttendance = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { startDate, endDate, groupId, status } = req.query;

    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (groupId) query.groupId = groupId;
    if (status) query.status = status;

    const attendance = await Attendance.find(query)
      .populate('memberId', 'name email')
      .populate('groupId', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Record attendance
exports.recordAttendance = async (req, res, next) => {
  try {
    const attendanceRecords = req.body.records; // Array of { memberId, groupId, status }
    
    const records = await Attendance.insertMany(attendanceRecords);
    
    res.status(201).json({
      success: true,
      data: records,
      message: `${records.length} attendance records created`
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance by member
exports.getAttendanceByMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const attendance = await Attendance.find({ memberId })
      .populate('groupId', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

// Update attendance record
exports.updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attendance) {
      const error = new Error('Attendance record not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};
```

### controllers/reportController.js

```javascript
const Report = require('../models/Report');
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// Generate attendance report
exports.generateAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get attendance data
    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end }
    });

    const totalMembers = await Member.countDocuments();
    const totalServices = await Attendance.distinct('date', {
      date: { $gte: start, $lte: end }
    }).length;
    
    const totalAttendance = attendanceRecords.filter(r => r.status === 'present').length;
    const averageAttendance = totalServices > 0 ? Math.round(totalAttendance / totalServices) : 0;
    const attendanceRate = totalMembers > 0 && totalServices > 0 
      ? Math.round((totalAttendance / (totalMembers * totalServices)) * 100) 
      : 0;

    // Group by month
    const monthlyData = {};
    attendanceRecords.forEach(record => {
      const month = new Date(record.date).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { present: 0, total: 0 };
      }
      monthlyData[month].total++;
      if (record.status === 'present') {
        monthlyData[month].present++;
      }
    });

    const reportData = {
      title: 'Attendance Report',
      reportType: 'attendance',
      startDate: start,
      endDate: end,
      summary: {
        totalMembers,
        averageAttendance,
        totalServices,
        attendanceRate
      },
      data: {
        monthly: monthlyData,
        raw: attendanceRecords
      }
    };

    const report = await Report.create(reportData);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// Get all reports
exports.getAllReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments();

    res.json({
      success: true,
      data: reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get report by ID
exports.getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};
```

### routes/members.js

```javascript
const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');

router.use(checkJwt); // All routes require authentication

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
```

### routes/groups.js

```javascript
const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addMemberToGroup
} = require('../controllers/groupController');

router.use(checkJwt); // All routes require authentication

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/members', addMemberToGroup);

module.exports = router;
```

### routes/attendance.js

```javascript
const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const {
  getAllAttendance,
  recordAttendance,
  getAttendanceByMember,
  updateAttendance
} = require('../controllers/attendanceController');

router.use(checkJwt); // All routes require authentication

router.get('/', getAllAttendance);
router.post('/', recordAttendance);
router.get('/member/:memberId', getAttendanceByMember);
router.put('/:id', updateAttendance);

module.exports = router;
```

### routes/reports.js

```javascript
const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const {
  generateAttendanceReport,
  getAllReports,
  getReportById
} = require('../controllers/reportController');

router.use(checkJwt); // All routes require authentication

router.get('/generate', generateAttendanceReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);

module.exports = router;
```

### server.js

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const memberRoutes = require('./routes/members');
const groupRoutes = require('./routes/groups');
const attendanceRoutes = require('./routes/attendance');
const reportRoutes = require('./routes/reports');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Setup Instructions

1. **Install MongoDB**: Make sure MongoDB is installed and running on your machine
   - Download from: https://www.mongodb.com/try/download/community

2. **Create the backend folder** and copy all files above into their respective locations

3. **Create `.env` file** based on `.env.example`:
```env
MONGO_URI=mongodb://localhost:27017/church_management
PORT=5000
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-audience
```

4. **Get Auth0 API Audience**:
   - Go to Auth0 Dashboard → Applications → APIs
   - Create a new API or use existing one
   - Copy the "Identifier" - this is your audience

5. **Install dependencies**:
```bash
npm install
```

6. **Run the server**:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Members
- `GET /api/members` - Get all members (with pagination, search, sort)
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get single group
- `POST /api/groups` - Create group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group

### Attendance
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Record attendance
- `GET /api/attendance/member/:memberId` - Get attendance by member
- `PUT /api/attendance/:id` - Update attendance

### Reports
- `GET /api/reports/generate?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Generate report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID

## Testing with Postman

1. Get an access token from Auth0
2. Add it to Authorization header: `Bearer YOUR_TOKEN`
3. Test the endpoints

All requests require authentication!