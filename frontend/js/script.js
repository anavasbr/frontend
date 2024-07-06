document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://127.0.0.1:5000';

    function carregarTarefas() {
        fetch(`${apiUrl}/buscar_tarefas`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#task-list tbody');
                tbody.innerHTML = '';
                data.forEach(tarefa => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${tarefa.titulo}</td>
                        <td>${tarefa.descricao}</td>
                        <td>${new Date(tarefa.prazo).toLocaleString()}</td>
                        <td>
                            <button class="edit" onclick="editarTarefa(${tarefa.id})">Editar</button>
                            <button class="delete" onclick="deletarTarefa(${tarefa.id})">Excluir</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            });
    }

    function cadastrarTarefa() {
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const prazo = document.getElementById('prazo').value;

        fetch(`${apiUrl}/cadastrar_tarefa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: titulo,
                descricao: descricao,
                prazo: prazo
            })
        })
        .then(response => response.json())
        .then(data => {
            carregarTarefas();
            document.getElementById('titulo').value = '';
            document.getElementById('descricao').value = '';
            document.getElementById('prazo').value = '';
        });
    }

    window.editarTarefa = function (id) {
        const titulo = prompt("Novo título:");
        const descricao = prompt("Nova descrição:");
        const prazo = prompt("Novo prazo (formato: AAAA-MM-DDTHH:MM):");

        if (titulo && descricao && prazo) {
            fetch(`${apiUrl}/editar_tarefa/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: titulo,
                    descricao: descricao,
                    prazo: prazo
                })
            })
            .then(response => response.json())
            .then(data => {
                carregarTarefas();
            });
        }
    }

    window.deletarTarefa = function (id) {
        if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
            fetch(`${apiUrl}/deletar_tarefa/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                carregarTarefas();
            });
        }
    }

    document.querySelector('button').addEventListener('click', cadastrarTarefa);

    carregarTarefas();
});
