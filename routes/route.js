const express = require('express');
const router = express.Router();
const create = require('../api/functions/create');
const view = require('../api/functions/view');
const exportUser = require('../api/functions/export-user');
const filterView = require('../api/functions/filter-view');
const update = require('../api/functions/update');
const importUser = require('../api/functions/import-user');
const authguard = require('../middlewares/auth');
const upload  = require('../middlewares/upload');
const uploadAWS  = require('../middlewares/uploadAWS');
const userDelete = require('../api/functions/delete');
const userDrop = require('../api/functions/drop');
const addBill = require('../api/functions/add-bill')
const getBills = require('../api/functions/get-bills')

// Create Route
router.route('/create-user').post(authguard,create.createUser)
// Update User
router.route('/update-user').post(authguard,update.updateUser)
// Get sample import CSV
router.route('/get-sample').get(authguard,importUser.getSample);
// Import User
router.route('/import-user').post(authguard,upload.single('file'),importUser.uploadUser);
// router.route('/import-user').post(authguard,uploadAWS.any(),importUser.uploadUser); ** Upload Using AWS

// View User
router.route('/view-users').get(authguard,view.viewUser)
// Export User
router.route('/export-users').get(authguard,exportUser.exportUser)
// View User Filtered
router.route('/view-users-filtered').post(authguard,filterView.filterViewUser)
// Delete User (soft delete)
router.route('/delete-user').post(authguard,userDelete.deleteUser)
// Delete User and his Folder
router.route('/drop-user').post(authguard,userDrop.dropUser)

//Upload Bill
router.route('/upload-bill').post(authguard,upload.single('file'),addBill.uploadBill)

// To download Bills
router.route('/get-bill').post(authguard,getBills.getBill)

module.exports = router;