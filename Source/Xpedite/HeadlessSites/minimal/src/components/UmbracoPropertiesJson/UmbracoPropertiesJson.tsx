import "./UmbracoPropertiesJson.css"

export default function UmbracoPropertiesJson(data: any) {
  if (!data) return <p>No page data</p>;

  const formattedJson = JSON.stringify(data, null, "  ");

  return (
    <div className="page-json">
      <div className="page-json-name">Umbraco Page JSON</div>
      <pre>
        <code>{formattedJson}</code>
      </pre>
    </div>
  );
}
