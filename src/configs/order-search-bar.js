// Função para pesquisa
// Função para pesquisa
function pesquisar() {
    const input = document.querySelector('input[name="pesquisa"]').value.toLowerCase();
    const table = document.getElementById('carros-table');
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const marca = row.querySelector('td:first-child').textContent.toLowerCase();
        if (marca.includes(input)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Adicione um ouvinte de evento de input no campo de pesquisa
document.querySelector('input[name="pesquisa"]').addEventListener('input', pesquisar);


// Função para ordenação
// Função para ordenação
function ordenar() {
    const select = document.querySelector('select[name="selecao"]');
    const selectedValue = select.value;
    const table = document.getElementById('carros-table');
    const originalRows = Array.from(table.querySelectorAll('tr'));
    const clonedTable = table.cloneNode(true); // Clone a tabela original

    const clonedRows = Array.from(clonedTable.querySelectorAll('tr'));
    clonedRows.shift(); // Remove o cabeçalho da tabela clonada

    clonedRows.sort((a, b) => {
        const marcaA = a.querySelector('td:first-child').textContent.toLowerCase();
        const marcaB = b.querySelector('td:first-child').textContent.toLowerCase();

        if (selectedValue === 'op2') {
            return marcaA.localeCompare(marcaB);
        } else if (selectedValue === 'op3') {
            return marcaB.localeCompare(marcaA);
        } else {
            return 0; // Mantém a ordem original
        }
    });

    // Limpa a tabela original
    table.innerHTML = '';

    // Adiciona o cabeçalho de volta à tabela original
    table.appendChild(originalRows[0]);

    // Adiciona as linhas ordenadas de volta à tabela original
    clonedRows.forEach(row => {
        table.appendChild(row);
    });
}


// Adicione ouvintes de eventos para chamar as funções acima quando os elementos são interagidos
document
  .querySelector(".search-bar button")
  .addEventListener("click", pesquisar);
document
  .querySelector('select[name="selecao"]')
  .addEventListener("change", ordenar);
