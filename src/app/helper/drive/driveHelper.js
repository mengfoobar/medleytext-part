
import DesktopDriveHelper from './desktopDriveHelper'

const DRIVE_MODE_INSTANCE_MAP={
    desktop: DesktopDriveHelper,
}

let DriveHelper;


module.exports={

    initialize:function(driveMode){
        localStorage.setItem("driveMode", driveMode);
        DriveHelper=DRIVE_MODE_INSTANCE_MAP[driveMode];

        return DriveHelper.initialize()
    },
    getInstance:function(){
        return DriveHelper
    }
}