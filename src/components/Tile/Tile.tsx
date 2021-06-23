import "./Tile.css";
import{
  PieceType,
}from "../../Constants";

interface Props {
  image?: string;
  ptype: PieceType;
}

export default function Tile({ ptype, image }: Props) {
  if(ptype === PieceType.BLACK) {
    return (
      <div className="tile">
        {image && <div style={{backgroundImage: `url(${image})`}} className="piece"></div>}
      </div>
    );
  }else if(ptype === PieceType.WHITE){
    return (
      <div className="tile">
        {image && <div style={{backgroundImage: `url(${image})`}} className="piece"></div>}
      </div>
    );
  }else if(ptype === PieceType.CANDIDATE){
    return(
      <div className="tile">
        {image && <div style={{backgroundImage: `url(${image})`}} className="candidate"></div>}
      </div>
    );
  }else{
    return (
        <div className="tile">
          <div style={{backgroundImage: `url(${undefined})`}} className="piece"></div>
        </div>
    );
  }
}
