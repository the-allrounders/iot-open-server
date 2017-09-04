export default ({ device, baseUrl }) => `
  <form method='post' action='${baseUrl}/device/${device._id}'>
    <fieldset>
      <label for='name'>
          Name:
          <input id='name' name='name' value='${device.name}'>
      </label>
      <br/>
      <label for='latitude'>
          Latitude:
          <input id='latitude' name='location[latitude]' value='${device.location.latitude || ''}'>
      </label>
      <br/
      <label for='longitude'>
          Longitude:
          <input id='longitude' name='location[longitude]' value='${device.location.longitude || ''}'>
      </label>
      <br/
      <label>
          <br/><br/>
          Data:
          ${device.dataTypes.map((entry, key) => `
              <br/><br/>
              <label for='data-label-${key}'>
                  Label
                  <input id='data-label-${key}' name='dataTypes[${key}][label]' value='${entry.label || ''}'>
              </label>
              <label for='data-key-${key}'>
                  Key
                  <input id='data-key-${key}' name='dataTypes[${key}][key]' value='${entry.key || ''}'>
              </label>
              <label for='data-type-${key}'>
                  Type
                  <input id='data-type-${key}' name='dataTypes[${key}][type]' value='${entry.type || ''}'>
              </label>
          `).join('')}
      </label>
      </fieldset>
    <button name='submit'>Save and go back</button>
    <button name='submitEdit' value='true'>Save</button>
  </form>
`
