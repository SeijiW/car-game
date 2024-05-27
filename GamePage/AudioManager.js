class AudioManager{
    static audiosPlaying = [];
    static totalAudiosPlayed = 0;
    static PlayAudio(audioVar, duration, replicationID, volume){
        let audioClone = audioVar.cloneNode(true)
        audioClone.volume = volume;
        audioClone.play();
        let num = AudioManager.totalAudiosPlayed;
        let thingToReturn = AudioManager.audiosPlaying.push({
            "audioVar" : audioVar,
            "num" : num,
            "duration" : duration,
            "replicationID" : replicationID
        });
        setTimeout(function() {
            for(let i = 0; i < AudioManager.audiosPlaying.length; i++){
                if(AudioManager.audiosPlaying[i].num == num){
                    AudioManager.audiosPlaying.splice(i, 1);
                }
            }; 
        }, duration);
        return thingToReturn;
    }
    static PlayAudioIfDone(audioVar, duration, replicationID, volume){
        let alreadyPlaying = false;
        for(let i = 0; i < this.audiosPlaying.length; i++){
            if(this.audiosPlaying[i].replicationID == replicationID){
                alreadyPlaying = true;
            }
        }
        if(!alreadyPlaying)
        this.PlayAudio(audioVar, duration, replicationID, volume);
    }
}