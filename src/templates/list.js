export default ({ devices, baseUrl }) => `
  
  <ol class="breadcrumb">
    <li class="breadcrumb-item active">Devices</li>
  </ol>
  
  <h1>Devices</h1>
  <table class='table'>
    <thead>
      <tr>
        <th>Name</th>
        <th>Token</th>
        <th>Operations</th>
      </tr>
    </thead>
    <tbody>
      ${devices.map(device => `
        <tr>
          <td>${device.name}</td>
          <td>${device.token}</td>
          <td>
            <a href='${baseUrl}/device/${device.id}' class='btn btn-primary'>Edit</a>
            <a href='${baseUrl}/device/${device.id}/delete' class='btn btn-danger'>Delete</a>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <a href='${baseUrl}/device/add' class='btn btn-primary btn-raised'>Add device</a>
`;
