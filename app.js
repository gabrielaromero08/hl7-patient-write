document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const cellPhone = document.getElementById('cellPhone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;

    // Verificar si ya existe un paciente con ese identifier
    fetch(`https://hl7-fhir-ehr-gabriela-787.onrender.com/patient?system=${encodeURIComponent(identifierSystem)}&value=${encodeURIComponent(identifierValue)}`)
        .then(response => {
            if (response.status === 204) {
                // No existe, se puede crear
                return null;
            } else if (response.ok) {
                // Ya existe un paciente
                throw new Error('Ya existe un paciente registrado con ese documento.');
            } else {
                throw new Error('Error consultando el paciente.');
            }
        })
        .then(() => {
            // Crear el objeto del paciente
            const patient = {
                resourceType: "Patient",
                name: [{
                    use: "official",
                    given: [name],
                    family: familyName
                }],
                gender: gender,
                birthDate: birthDate,
                identifier: [{
                    system: identifierSystem,
                    value: identifierValue
                }],
                telecom: [{
                    system: "phone",
                    value: cellPhone,
                    use: "home"
                }, {
                    system: "email",
                    value: email,
                    use: "home"
                }],
                address: [{
                    use: "home",
                    line: [address],
                    city: city,
                    postalCode: postalCode,
                    country: "Colombia"
                }]
            };

            // Enviar los datos para crear el paciente
            return fetch('https://hl7-fhir-ehr-gabriela-787.onrender.com/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patient)
            });
        })
        .then(response => {
            if (response && response.ok) {
                return response.json();
            } else {
                throw new Error('Error al crear el paciente.');
            }
        })
        .then(data => {
            alert('✅ Paciente registrado exitosamente.');
            document.getElementById('patientForm').reset();
        })
        .catch(error => {
            alert(`❌ ${error.message}`);
            console.error(error);
        });
});

