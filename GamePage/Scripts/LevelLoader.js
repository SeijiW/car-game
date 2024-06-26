class LevelLoader{
    static levelList = [];
    static sizeOfBoxes = 4;
    static currentLevel;
    static allLevelsList = [];
    static currentLevelName;
    static SaveLevel(){
        let levelCode = "";
        if(LevelLoader.levelList.length == 0) return "";
        for(let i = 0; i < LevelLoader.levelList.length; i++){
            if(LevelLoader.levelList[i].name == "Concrete")
            levelCode += LevelLoader.levelList[i].GetComponent(Transform).x + "," + LevelLoader.levelList[i].GetComponent(Transform).y + ":";
            else if(LevelLoader.levelList[i].name == "Finish")
            levelCode += LevelLoader.levelList[i].GetComponent(Transform).x + "," + LevelLoader.levelList[i].GetComponent(Transform).y + "F";
        }
        return levelCode; 
    }
    static LoadLevel(code){
        //clears current level
        this.ClearLevelList();

        //goes through level code
        let currentNumber = "";
        let currentXValue = 0;
        let currentYValue = 0;
        for(let i = 0; i < code.length; i++){
            let currentChar = code.charAt(i);
            if(currentChar == ","){
                currentXValue = parseFloat(currentNumber);
                currentNumber = "";
            }
            else if(currentChar == ":"){
                currentYValue = parseFloat(currentNumber);
                LevelLoader.SpawnPieceAtPosition(currentXValue, currentYValue, false);
                currentNumber = "";
            }
            else if(currentChar == "F"){
                currentYValue = parseFloat(currentNumber);
                LevelLoader.SpawnPieceAtPosition(currentXValue, currentYValue, true);
                currentNumber = "";
            }
            else{
                currentNumber += currentChar;
            }
        }
    }
    static ClearLevelList(){
        for(let i = 0; i < LevelLoader.levelList.length; i++){
            destroy(LevelLoader.levelList[i]);
        }
        LevelLoader.levelList = [];
    }
    static SpawnPieceAtPosition(x, y, isFinish){
        if(!isFinish)
        LevelLoader.levelList.push(createObject(new Object("Concrete", [new ImageRenderer(ConcreteIMG, 377), new Transform(x,y,LevelLoader.sizeOfBoxes,LevelLoader.sizeOfBoxes,0)])));
        else
        LevelLoader.levelList.push(createObject(new Object("Finish", [new ImageRenderer(FinishIMG, 377), new Transform(x,y,LevelLoader.sizeOfBoxes,LevelLoader.sizeOfBoxes,0)])));
    }
    static PlayNextLevel(){
        if(this.currentLevelName != undefined){
            for(let i = 0; i < this.allLevelsList.length; i++){
                if(this.allLevelsList[i].name == this.currentLevelName){
                    if(i == this.allLevelsList.length-1){
                        GameBeaten();
                        break;
                    }
                    else{
                        LevelSetUp(true);
                        this.currentLevelName = this.allLevelsList[i+1].name;
                        this.LoadLevel(this.allLevelsList[i+1].code);
                        break;
                    }
                }
            }
        }
    }
    static ReloadCurrentLevel(){
        if(this.currentLevelName != undefined){
            for(let i = 0; i < this.allLevelsList.length; i++){
                if(this.allLevelsList[i].name == this.currentLevelName){
                    LevelSetUp(true);
                    this.LoadLevel(this.allLevelsList[i].code);
                    break;
                }
            }
        }
    }

    static circleLevel = "17,-28:15,-29:13,-30:11,-31:8,-32:6,-32:3,-32:1,-32:-2,-32:-4,-32:-6,-31:-9,-30:-11,-29:-13,-28:-15,-26:-17,-25:-19,-23:-20,-21:-22,-19:-23,-17:-24,-15:-25,-12:-26,-10:-26,-8:-26,-5:-26,-3:-26,0:-26,2:-25,4:-24,7:-23,9:-22,11:-20,13:-19,15:-17,17:-15,18:-13,20:-11,21:-9,22:-6,23:-4,24:-2,24:1,24:3,24:6,24:8,24:11,23:13,22:15,21:17,20:19,18:21,17:23,15:24,13:26,11:27,9:28,7:29,4:30,2:30,0:30,-3:30,-5:30,-8:30,-10:29,-12:28,-15:27,-17:26,-19:24,-21:23,-23:21,-25:19,-26:15,-16:13,-17:12,-18:11,-19:9,-20:8,-20:7,-21:5,-21:3,-22:2,-22:0,-22:-1,-22:-3,-21:-4,-21:-6,-20:-7,-20:-9,-19:-10,-18:-11,-17:-12,-16:-13,-15:-14,-13:-15,-12:-16,-10:-16,-9:-17,-7:-17,-6:-17,-4:-17,-3:-17,-1:-17,0:-16,2:-16,4:-15,5:-14,6:-13,8:-12,9:-11,10:-10,11:-9,12:-7,13:-6,13:8,13:9,13:11,12:12,11:13,10:15,9:16,8:16,6:17,5:18,4:18,2:19,0:19,-1:19,-3:19,-4:19,-6:19,-7:18,-9:18,-10:17,-12:16,-13:16,-15:')";

    static level1 = '-4,-8:0,-8:4,-8:-8,-8:8,-8:0,12:12,-8:12,-4:12,0:12,4:12,8:12,12:12,16:12,20:-12,-8:-12,-4:-12,0:-12,4:-12,8:-12,12:-12,16:-12,20:-12,24:-12,28:-12,32:-8,28:-4,28:12,24:12,28:-8,40:-4,44:16,28:20,28:24,28:28,44:32,40:28,28:32,28:36,28:40,28:36,40:40,40:44,40:44,28:48,28:48,40:48,32F48,36F44,36F44,32F40,32F40,36F52,40:52,36:52,32:52,28:-16,8:-16,4:-16,0:-16,-4:-16,-8:-16,-12:-12,-12:-8,-12:-4,-12:0,-12:4,-12:8,-12:12,-12:16,-12:16,-4:16,-8:16,0:16,4:16,8:16,12:16,16:16,20:16,24:20,24:24,24:28,24:32,24:36,24:40,24:44,24:48,24:52,24:56,24:56,28:56,32:56,36:56,40:56,44:52,44:48,44:44,44:40,44:36,44:32,44:-8,44:-16,32:-16,28:-16,24:-16,20:-16,16:-16,12:24,44:20,44:16,44:12,44:8,44:4,44:0,44:-4,40:4,40:8,40:12,40:16,40:20,40:24,40:28,40:0,40:-4,32:-4,36:-8,36:-8,32:';
    static level2 = '-4,-8:0,-8:4,-8:4,-4:4,0:-4,-4:-4,0:-4,4:-4,8:-4,12:-4,16:0,20:4,24:4,4:4,8:8,12:12,16:8,28:12,32:16,36:16,20:20,24:24,28:20,40:28,28:32,28:36,28:36,32:36,36:36,40:36,44:36,48:20,44:20,48:20,52:20,56:36,52:36,56:36,60:36,64:36,68:36,72:32,72:28,72:24,72:20,72:16,72:12,72:8,72:4,72:0,72:-4,72:-8,72:-12,72:-16,72:-20,72:-24,72:-28,72:16,56:12,56:8,56:4,56:0,56:-4,56:-8,56:-12,56:-16,56:-20,56:-24,56:-28,56:-32,56:-32,72:-36,72:-40,68:-44,64:-36,52:-48,60:-36,48:-48,56:-48,52:-48,48:-48,44:-36,44:8,8:12,8:12,12:16,12:20,12:16,16:20,16:20,20:24,24:28,24:32,24:36,24:36,20:8,-8:8,-4:8,0:8,4:12,4:12,0:12,-4:16,0:16,4:16,8:20,8:20,4:24,8:24,12:24,16:24,20:28,20:28,16:28,12:32,16:32,20:8,-12:4,-12:0,-12:-4,-12:-8,-12:4,-16:0,-16:-4,-16:-8,-16:-12,-12:-12,-8:-8,-8:-12,-4:-12,0:-12,4:-12,8:-12,12:-12,16:-12,20:-12,24:-12,28:-8,24:-8,20:-8,16:-8,12:-8,8:-8,4:-8,0:-8,-4:-8,32:-4,32:-4,36:0,36:0,40:4,40:4,44:8,44:8,48:12,48:12,52:16,52:16,48:16,44:16,40:12,40:12,36:8,32:4,28:0,24:-4,20:-4,24:-8,28:-4,28:0,28:0,32:4,32:4,36:8,36:8,40:12,44:0,44:-4,44:-8,44:-12,44:-16,44:-20,44:-24,44:-28,44:-32,44:-32,52:-28,52:-24,52:-20,52:-16,52:-12,52:-8,52:-4,52:0,52:4,52:8,52:4,48:0,48:-4,48:-8,48:-12,48:-16,48:-20,48:-24,48:-28,48:-32,48:-52,44:-56,44:-56,48:-56,52:-56,56:-56,60:-56,64:-56,68:-56,72:-56,76:-52,76:-48,76:-44,76:-40,76:-36,76:-40,72:-44,72:-48,72:-52,72:-52,68:-52,64:-52,60:-52,56:-52,52:-52,48:-48,64:-48,68:-44,68:-32,76:-28,76:-24,76:-12,76:-8,76:-4,76:0,76:4,76:8,76:-20,76:-24,80:-16,76:-52,80:-48,80:-44,80:-40,80:-36,80:-32,80:-28,80:-20,80:-16,80:-12,80:-8,80:-4,80:0,80:4,80:8,80:12,80:16,80:20,80:24,80:28,80:32,80:36,80:36,76:32,76:28,76:24,76:20,76:16,76:12,76:40,80:40,76:40,68:40,64:40,60:40,56:40,48:40,44:40,40:40,36:40,32:40,52:40,28:40,24:44,28:44,32:44,36:44,40:44,44:44,48:44,52:44,56:40,72:44,72:44,76:44,68:44,64:44,60:44,24:40,20:36,16:40,16:44,20:-44,44F-40,44F-44,40F-40,40F-40,36F-40,32F-44,32F-44,36F-56,40:-56,36:-56,32:-48,32:-48,36:-48,40:-52,40:-52,36:-52,32:-36,40:-32,40:-28,40:-24,40:-20,40:-16,40:-12,40:-8,40:-4,40:-8,36:-12,36:-16,36:-20,36:-24,36:-28,36:-32,36:-36,36:-36,32:-32,32:-28,32:-24,32:-20,32:-16,32:-12,32:-56,4:-52,4:-48,4:-44,4:-40,4:-36,4:-32,4:-28,4:-24,4:-20,4:-16,4:-56,0:-52,0:-48,0:-44,0:-40,0:-36,0:-32,0:-28,0:-24,0:-20,0:-16,0:';
    static level3 = '0,-8:-4,-8:-8,-4:4,-8:8,-4:8,0:-8,0:-8,4:-8,8:-8,12:-8,16:-8,20:-4,24:8,4:8,8:12,12:20,16:24,16:28,16:32,16:36,16:40,12:16,16:0,28:4,32:8,32:12,32:16,32:20,32:24,32:28,32:32,32:36,32:40,32:44,32:48,32:52,28:56,24:44,8:48,4:60,20:64,16:68,12:68,8:68,4:68,0:68,-4:68,-8:68,-12:68,-16:68,-20:68,-24:68,-28:20,24:36,20:52,24:48,8:64,12:48,0:48,-4:48,-8:52,0:64,-12:48,-12:48,-16:48,-20:48,-24:52,-28:48,-28:68,-32:68,-36:68,-40:64,-44:60,-48:48,-32:44,-36:40,-40:56,-52:44,-40:44,-52:40,-52:36,-52:32,-52:28,-52:36,-40:32,-40:28,-40:24,-40:20,-48:24,-48:20,-40:16,-40:16,-48:16,-44F12,-44F8,-44F8,-40:12,-40:12,-48:8,-48:48,-52:52,-52:64,-28:-36,-44:-36,-52:-36,-36:';
    static level4 = '-4,-8:0,-8:4,-8:8,-8:12,-8:12,-4:-8,-8:-12,-8:-12,-4:-12,0:-12,4:-12,8:-12,12:-12,16:-12,20:-12,24:-12,28:-12,32:-12,36:-12,40:-12,44:-12,48:-12,52:-12,56:-12,60:-12,64:-12,68:-12,72:-12,76:-12,80:-12,84:-12,88:-12,92:-12,96:-12,100:-12,104:-12,108:-12,112:-12,116:-12,120:-12,124:-12,128:12,0:12,4:12,12:12,16:12,20:12,28:12,32:12,36:12,44:12,48:12,52:12,60:12,64:12,68:12,76:12,80:12,84:12,92:12,96:12,100:12,108:12,112:12,116:12,124:12,128:12,8:12,24:12,40:12,56:12,72:12,88:12,104:12,120:-8,40:8,76:-12,132:-12,136:-12,144:-12,152:-12,156:-12,164:-12,172:-12,176:-12,184:-12,192:-12,196:-12,204:-12,212:-12,216:-12,224:-12,232:-12,236:-12,244:-12,252:-12,256:-12,264:-12,272:-12,276:-12,284:-12,292:-12,140:-12,148:-12,160:-12,168:-12,180:-12,188:-12,200:-12,208:-12,220:-12,228:-12,240:-12,248:-12,260:-12,268:-12,280:-12,288:-12,296:-12,300:-12,304:-12,308:-12,312:-12,316:-12,320:-12,324:-12,328:-12,332:-12,336:-12,340:-12,344:-12,348:-12,352:-12,356:-12,360:-12,364:-12,368:-12,372:-12,376:-12,380:-12,384:-12,388:-12,392:-12,396:-12,400:-12,404:-12,408:-12,412:-12,416:-12,420:-12,424:-12,428:-12,432:-12,436:-12,440:-12,444:-12,448:-12,452:-12,456:-12,460:-12,464:-12,468:-12,472:-12,476:-12,480:-12,484:-12,488:-12,492:-12,496:-12,500:-12,504:-12,508:-12,512:-12,516:-12,520:-12,524:-12,528:-12,532:-12,536:12,132:12,136:12,140:12,144:12,148:12,152:12,156:12,160:12,164:12,168:12,172:12,176:12,180:12,184:12,188:12,192:12,196:12,200:12,204:12,208:12,212:12,216:12,220:12,224:12,228:12,232:12,236:12,240:12,244:12,248:12,252:12,256:12,260:12,264:12,268:12,272:12,276:12,280:12,284:12,288:12,292:12,296:12,300:12,304:12,308:12,312:12,316:12,320:12,324:12,328:12,332:12,336:12,340:12,344:12,348:12,352:12,356:12,360:12,364:12,368:12,372:12,376:12,380:12,384:12,388:12,392:12,396:12,400:12,404:12,408:12,412:12,416:12,420:12,424:12,428:12,432:12,436:12,440:12,444:12,448:12,452:12,456:12,460:12,464:12,468:12,472:12,476:12,480:12,484:12,488:12,492:12,496:12,500:12,504:12,508:12,512:12,516:12,520:12,524:12,528:12,532:12,536:-8,136:0,184:4,228:-4,264:4,312:-4,348:8,388:-8,472:8,496:-4,536:-12,540:-12,544:-12,548:-12,552:-12,556:12,556:12,552:12,548:12,544:12,540:12,560:12,564:12,568:8,568:4,568:0,568:-4,568:-8,568:-12,568:-12,564:-12,560:-8,564F-4,564F0,564F4,564F8,564F8,560F8,556F8,552F4,552F0,552F-4,552F-8,552F-8,556F-8,560F-4,560F0,560F4,560F4,556F0,556F-4,556F';
    static level5 = '-8,0:-8,-4:-8,-8:-4,-8:0,-8:4,-8:8,-8:8,-4:8,0:-8,4:-8,8:8,4:-8,12:-8,16:-4,20:0,24:4,28:8,28:12,28:16,28:20,28:12,8:16,8:8,8:20,8:20,4:20,0:20,-4:24,28:28,24:32,20:36,16:36,12:36,8:36,4:36,0:36,-4:36,-8:20,-8:16,-12:12,-16:8,-16:0,-16:4,-16:-4,-16:-8,-16:36,-12:32,-16:28,-20:24,-24:20,-28:16,-28:12,-28:8,-28:4,-28:0,-28:-4,-28:-8,-28:-12,-28:-12,-16:-16,-12:-16,-8:-16,-28:-20,-28:-24,-28:-28,-24:-32,-20:-32,-16:-32,-12:-32,-8:-32,-4:-16,-4:-16,0:-16,4:-16,8:-16,12:-16,16:-16,20:-12,24:-8,28:-4,32:0,36:4,36:8,36:12,36:16,36:20,36:-32,0:-32,4:-32,8:-32,12:-32,16:-32,20:-28,24:-24,28:-20,32:-16,36:-12,40:-8,44:-4,48:0,48:4,48:8,48:12,48:16,48:20,48:24,48:28,48:32,44:36,40:40,36:24,36:28,32:32,28:36,24:40,32:40,24:44,24:44,32:48,32:52,32:48,24:52,24:52,28:40,28F44,28F48,28F';
    static level6 = '0,-8:-4,-8:-8,-8:-8,-4:-8,0:-8,4:8,4:8,0:8,-4:8,-8:4,-8:8,8:8,12:8,16:8,20:4,12:0,12:-8,8:-8,12:-8,16:-8,20:-8,24:-8,28:-8,32:-8,36:-4,24:0,24:8,28:8,24:8,32:8,36:4,36:0,36:-8,40:-8,44:-8,48:-4,48:0,48:4,48:8,48:12,48:16,48:4,44:12,36:16,36:16,40:20,48:24,48:28,48:32,48:36,48:40,48:24,44:32,40:20,36:24,36:28,36:32,36:36,36:40,36:40,40F40,44F60,40:52,44:68,40:76,44:';
}
//sets the value of all levels in the array
LevelLoader.allLevelsList.push({"code":LevelLoader.level1,"name":"Level 1"});
LevelLoader.allLevelsList.push({"code":LevelLoader.level2,"name":"Level 2"});
LevelLoader.allLevelsList.push({"code":LevelLoader.level3,"name":"Level 3"});
LevelLoader.allLevelsList.push({"code":LevelLoader.level4,"name":"Level 4"});
LevelLoader.allLevelsList.push({"code":LevelLoader.level5,"name":"Level 5"});
LevelLoader.allLevelsList.push({"code":LevelLoader.level6,"name":"Level 6"});
