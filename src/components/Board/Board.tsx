import { useRef, useState } from "react";
import "./Board.css";
import {Button, Tile} from "./Tile/Tile";
import Adversary from "../Adversary";
import click from '../assets/sound/click.mp3';

import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  CIMAGE,
  LEVELS,
  Piece,
  PieceType,
  initialBoardState,
  TeamType,
} from "../../Constants";
const malloc = require('lodash');

let LEVEL : number = 2;
let candidateMoves: number[] = [];

export function Menu(){
  const menuRef = useRef<HTMLDivElement>(null);

  function changeDifficulty(e: React.MouseEvent){
    const element = e.target as HTMLElement;
    const menu = menuRef.current;

    if((element.classList.contains("button0")||element.classList.contains("button1")||
      element.classList.contains("button2")||element.classList.contains("button3")) && menu){
      const index: number = +element.id;
      LEVEL = LEVELS[index-100];
      var audio = new Audio();
      audio.src = click;
      audio.play();
    } 
  }

  let buttons = [];
  buttons.push(<Button key={`${9},${9}`} id = {`${100+4}`} ptype={PieceType.NONE}/>);
  for (let index = 0; index < 4; index++) {
    buttons.push(<Button key={`${9},${index}`} id = {`${100+index}`} ptype={PieceType.NONE}/>);
  }

  return (
    <div
      onMouseDown={(e) => changeDifficulty(e)}
      id="menu"
      ref={menuRef}
    >
      {buttons}
    </div>
  );
}

export function Board(){
  const machine = new Adversary();
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const boardRef = useRef<HTMLDivElement>(null);

  if(candidateMoves.length === 0){

    candidateMoves = machine.validMoves(pieces, TeamType.OUR, true);
  
    for(let i = 0 ; i < candidateMoves.length ; i++){
      pieces[candidateMoves[i]] = {
        image: CIMAGE,
        position: {
          x: (candidateMoves[i]%HORIZONTAL_AXIS.length),
          y: Math.floor(candidateMoves[i]/HORIZONTAL_AXIS.length),
        },
        type: PieceType.CANDIDATE,
        team: TeamType.NONE,
      }
    }
  }

  function dropPiece(e: React.MouseEvent){
    const element = e.target as HTMLElement;
    const board = boardRef.current;

    if(element.classList.contains("candidate") && board){
      //finding piece through element id
      const index: number = +element.id;
      for(let i = 0; i < candidateMoves.length; i++){
        pieces[candidateMoves[i]].type = PieceType.NONE;
      }

      let updatedPieces = malloc.clone(pieces, true);
      updatedPieces = machine.makeWMove(updatedPieces, index, true);
      setPieces(updatedPieces);
      updatedPieces = malloc.clone(updatedPieces, true);

      let i = Math.random();
      if((i*LEVEL) < 0.6){
        let candBMoves = machine.validMoves(updatedPieces, TeamType.OPPONENT, false);
        let iaMove = candBMoves[Math.floor(i*candBMoves.length)];
        setTimeout(()=>{updatedPieces = machine.makeBMove(updatedPieces, iaMove, true)}, 999);
      }else{
        let iaMove = machine.alphaBeta(updatedPieces, LEVEL);
        setTimeout(()=>{updatedPieces = machine.makeBMove(updatedPieces, iaMove, true)}, 999);
      }
      setTimeout(()=>{candidateMoves.length=0; setPieces(updatedPieces)}, 1111);
    } 
  }

  let rboard = [];

  for(let j = VERTICAL_AXIS.length - 1; j >= 0; j--){
    for(let i = 0; i < HORIZONTAL_AXIS.length; i++){
      const number = j*HORIZONTAL_AXIS.length+i;
      const piece = pieces[number];

      let image = piece ? piece.image : undefined;
      let ptype = piece ? piece.type : PieceType.NONE;

      rboard.push(<Tile key={`${i},${j}`} id = {`${number}`} image={image} ptype={ptype} />);
    }
  }

  return (
    <div
      onMouseDown={(e) => dropPiece(e)}
      id="board"
      ref={boardRef}
    >
      {rboard}
    </div>
  );
}
const _ = {
  Menu,
  Board
}

export default _;
