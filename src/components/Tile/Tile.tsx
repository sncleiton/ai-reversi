import "./Tile.css";
import{
  PieceType,
}from "../../Constants";

interface Props {
  id :string;
  image?: string;
  ptype: PieceType;
}

export default function Tile({id, ptype, image }: Props) {
  if(ptype === PieceType.BLACK) {
    return (
      <div className="tile">
        {image && <div id={id} style={{backgroundImage: `url(${image})`}} className="piece"></div>}
      </div>
    );
  }else if(ptype === PieceType.WHITE){
    return (
      <div className="tile">
        {image && <div id={id} style={{backgroundImage: `url(${image})`}} className="piece"></div>}
      </div>
    );
  }else if(ptype === PieceType.CANDIDATE){
    return(
      <div className="tile" >
        {image && <div id={id} style={{backgroundImage: `url(${image})`}} className="candidate"></div>}
      </div>
    );
  }else{
    return (
        <div className="tile">
          <div id={id} className="piece"></div>
        </div>
    );
  }
}