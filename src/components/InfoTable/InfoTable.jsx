import "./InfoTable.css";

const InfoTable = ({ infoList, name, cx, cy, maxWidth, maxHeight }) => {
  return (
    <div
      className="info-table__container"
      style={{ [cx.position]: cx.value, [cy.position]: cy.value }}
      maxwidth={maxWidth && maxWidth}
      maxheight={maxHeight && maxHeight}
    >
      <header>{name}</header>
      <section className="info-table__body">
        {infoList.map((info) => (
          <div className="info-table__row" key={info.title}>
            <span>{info.title}</span>
            <span>{info.content}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default InfoTable;
