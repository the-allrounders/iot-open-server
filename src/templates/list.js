export default ({ devices, baseUrl }) => `
  <a href='${baseUrl}/device/add'><button>Add device</button></a>
  <h1>Devices</h1>
  <table class='table'>
    <thead>
    <tr>
    <th>ID</th>
    <th>Name</th>
    <th colspan='2'>Operations</th>
    </tr>
    </thead>
    <tbody>
    ${devices.map(device => `
        <tr>
            <td>${device.id}</td>
            <td>${device.name}</td>
            <td><a href='${baseUrl}/device/${device.id}'>Edit</a></td>
            <td><a href='${baseUrl}/device/${device.id}/delete'>Delete</a></td>
        </tr>
    `).join('')}
  </tbody>
</table>
`
