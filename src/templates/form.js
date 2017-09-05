export default ({ device, baseUrl }) => `
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="${baseUrl}">Devices</a></li>
    <li class="breadcrumb-item active">${device.name}</li>
  </ol>
  
  <form method='post' action='${baseUrl}/device/${device._id}'>
    <legend>Device</legend>
    <div class="form-group row">
      <label for='name' class="col-2 col-form-label">Device name</label>
      <div class="col-10">
        <input id='name' name='name' value='${device.name}' class="form-control">
      </div>
    </div>
    <legend>Location of the device</legend>
    <div class="form-group row">
       <label for="latitude" class="col-2 col-form-label">Latitude</label>
       <div class="col-10">
         <input id='latitude' name='location[latitude]' value='${device.location.latitude || ''}' class="form-control">
       </div>
    </div>
    <div class="form-group row">
       <label for="latitude" class="col-2 col-form-label">Longitude</label>
       <div class="col-10">
         <input id='latitude' name='location[longitude]' value='${device.location.longitude || ''}' class="form-control">
       </div>
    </div>
    <legend>Data types</legend>
    <div class="form-group row">
      <label class="col-3 col-form-label">Key</label>
      <label class="col-3 col-form-label">Label</label>
      <label class="col-3 col-form-label">Type</label>
    </div>
      ${device.dataTypes.map((entry, key) => `
        <div class="form-group row">
          <div class="col-3">
            <input name='dataTypes[${key}][key]' value='${entry.key || ''}' placeholder="Key" class="form-control">
          </div>
          <div class="col-3">
            <input name='dataTypes[${key}][label]' value='${entry.label || ''}' placeholder="Label" class="form-control">
          </div>
          <div class="col-3">
            <select name='dataTypes[${key}][type]' class="form-control">
              <option disabled ${entry.type ? '' : 'selected'}> -- Select a type --</option>
              <option disabled></option>
              <option disabled>Special types</option>
              <option value="temperature" ${entry.type === 'temperature' ? 'selected' : ''}>Temperature (in Celsius)</option>
              <option value="humidity" ${entry.type === 'humidity' ? 'selected' : ''}>Humidity (in decimals)</option>
              <option value="windforce" ${entry.type === 'windforce' ? 'selected' : ''}>Windforce (in km/h)</option>
              <option disabled></option>
              <option disabled>Generic types</option>
              <option value="number" ${entry.type === 'number' ? 'selected' : ''}>Number</option>
              <option value="text" ${entry.type === 'text' ? 'selected' : ''}>Text</option>
              <option value="boolean" ${entry.type === 'boolean' ? 'selected' : ''}>Boolean</option>
              
            </select>
          </div>
        </div>
      `).join('')}
    <button name='submitEdit' value='true' class="btn btn-raised btn-primary">Save</button>
  </form>
`
