import{
    BIMAGE,
    WIMAGE,
    DIR,
    HORIZONTAL_AXIS,
    PieceType,
    TeamType,
    Piece,
}from "../Constants";


  export default class Adversary{
  
    makeWMove(pieces: Piece[], play: number, actual: boolean){
      let dirs = [];
      let path;
    
      for(let i = 0; i < DIR.length; i++){
        if(this.feasibleMove(pieces, play, DIR[i], TeamType.OUR)){
          dirs.push(DIR[i]);
        }
      }
      pieces[play] = {
        image: WIMAGE,
        position: {
          x: (play%HORIZONTAL_AXIS.length),
          y: Math.floor(play/HORIZONTAL_AXIS.length),
        },
        type: PieceType.WHITE,
        team: TeamType.OUR,
      }

      for(let i=0; i<dirs.length; i++){
    
        path = play + dirs[i];
    
        while(pieces[path].team===TeamType.OPPONENT){
    
          pieces[path] = {
            image: WIMAGE,
            position: {
              x: (path%HORIZONTAL_AXIS.length),
              y: Math.floor(path/HORIZONTAL_AXIS.length),
            },
            type: PieceType.WHITE,
            team: TeamType.OUR,
          }
          path = path + dirs[i];
        }
      }

      if(actual){
        var audio = new Audio();
        if(dirs.length < 3){
          audio.src = "assets/sound/put_piece.wav";
          audio.play();
        }else{
          audio.src = "assets/sound/go_go.ogg";
          audio.play();
        }
      }
      return pieces;
    }



    makeBMove(pieces: Piece[], play: number, actual :boolean){
      let dirs: number[] = [];
      let path;
    
      for(let i = 0; i < DIR.length; i++){
        if(this.feasibleMove(pieces, play, DIR[i], TeamType.OPPONENT)){
          dirs.push(DIR[i]);
        }
      }

      pieces[play] = {
        image: BIMAGE,
        position: {
          x: (play%HORIZONTAL_AXIS.length),
          y: Math.floor(play/HORIZONTAL_AXIS.length),
        },
        type: PieceType.BLACK,
        team: TeamType.OPPONENT,
      }
    
      for(let i=0; i < dirs.length; i++){
    
        path = play + dirs[i];
    
        while(pieces[path].team === TeamType.OUR){
    
          pieces[path] = {
            image: BIMAGE,
            position: {
              x: (path%HORIZONTAL_AXIS.length),
              y: Math.floor(path/HORIZONTAL_AXIS.length),
            },
            type: PieceType.BLACK,
            team: TeamType.OPPONENT,
          }
          path = path + dirs[i];
        }
      }


      if(actual){
        var audio = new Audio();
        if(dirs.length < 3){
          audio.src = "assets/sound/put_piece.wav";
          audio.play();
        }else{
          audio.src = "assets/sound/look_out.ogg";
          audio.play();
        }
      }
      return pieces;
    }

    feasibleMove(pieces: Piece[], move: number, dir:number, team: TeamType){
      
      let path = move + dir;
  
      if((path >= 0)&&(path < pieces.length)){
        //Not allowed to go through walls.
        if(((path%8 === 0)&&((path-dir)%8 === 7))||
          ((path%8 === 7)&&((path-dir)%8 === 0))){
          return false;
        }

        while((pieces[path].team!==TeamType.NONE)&&
          (pieces[path].team!==team)){

          path = path + dir;

          if((path >= 0)&&(path < pieces.length)){
            //No, you're not allowed to go through walls.
            if(((path%8 === 0)&&((path-dir)%8 === 7))||
              ((path%8 === 7)&&((path-dir)%8 === 0))){
              return false;
            }

            if(pieces[path].team === team){
              return true;
            }
          }else{
            break;
          }
        }
      }
      return false;
    }

    validMoves(pieces: Piece[], team: TeamType, actual: boolean){
      let sucessors: number[] = [];
    
      for(let move = 0; move < pieces.length; move++){

        if(pieces[move].team === TeamType.NONE){

          for(let i = 0; i < DIR.length; i++){

            if(this.feasibleMove(pieces, move, DIR[i], team)){

              sucessors.push(move);
              i = DIR.length;
            }
          }
        }
      }

      if(actual && (sucessors.length===0)){
        let audio = new Audio();
        if(this.utilityGame(pieces)>0){
          audio.src = "assets/sound/over_lose.ogg";
          audio.play();
        }else{
          audio.src = "assets/sound/you_win.ogg";
          audio.play();
        }
      }
      return sucessors;
    }

    utilityGame(pieces: Piece[]){

      let rUtility: number = 0;

      for(let i = 0; i < pieces.length; i++){
        if(pieces[i].team === TeamType.OPPONENT){

          rUtility++;
        }else if(pieces[i].team === TeamType.OUR){
          rUtility--;
        }
      }
      return rUtility;
    }

    minValue(
      pieces: Piece[], lastMove:number,
      layer:number, depth:number,
      alpha: number, beta: number){

      if(depth <= layer){
        return [this.utilityGame(pieces), lastMove];
      }

      let sucessors = this.validMoves(pieces, TeamType.OUR, false);

      let tempUtility = [Infinity, lastMove];

      for(let i = 0; i < sucessors.length; i++){

        const _ = require('lodash');
        let copyPieces = _.clone(pieces, true);

        copyPieces = this.makeWMove(copyPieces, sucessors[i], false);

        let maxUtility = this.maxValue(
          copyPieces, sucessors[i], layer+1, depth, alpha, beta
        );

        if(tempUtility[0] > maxUtility[0]){

          tempUtility = maxUtility;
        }

        if(tempUtility[0] <= alpha){
          return tempUtility
        }

        if(tempUtility[0] < beta){
          beta = tempUtility[0];
        }
        copyPieces = null;
      }
      return tempUtility;
    }


    maxValue(
      pieces: Piece[], lastMove:number,
      layer:number, depth:number,
      alpha: number, beta: number){

      if(depth <= layer){
        return [this.utilityGame(pieces), lastMove];
      }

      let sucessors = this.validMoves(pieces, TeamType.OPPONENT, false);

      let tempUtility = [-Infinity, 1];

      if(layer === 0){
        tempUtility[1] = sucessors[0];
      }

      for(let i = 0; i < sucessors.length; i++){
        
        const _ = require('lodash');
        let copyPieces = _.clone(pieces, true);

        copyPieces = this.makeBMove(copyPieces, sucessors[i], false);

        let minUtility = this.minValue(
          copyPieces, sucessors[i], layer+1, depth, alpha, beta
        );

        if(tempUtility[0] < minUtility[0]){
          tempUtility[0] = minUtility[0];
          if(layer === 0){
            tempUtility[1] = sucessors[i];
          }
        }

        if(tempUtility[0] >= beta){
          return tempUtility;
        }

        if(tempUtility[0] > alpha){
          alpha = tempUtility[0];
        }

        copyPieces = null;
      }
      return tempUtility;
    }

    alphaBeta(pieces: Piece[], depth: number ){
      let utilityMove: number[],
       alpha: number, beta: number;

      alpha = -Infinity;
      beta = Infinity;

      utilityMove = this.maxValue(pieces, 0, 0,
         depth, alpha, beta);

      return utilityMove[1];
    }
  }