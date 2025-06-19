function deleteRecord(model, id, lng) {
    if(lng == 'en' || lng == 'en-US') {
        var msg = 'Are you sure you want to delete this record?';
    }
    else {
        var msg = '¿Estás seguro de que deseas eliminar este registro?';
    }
    if (confirm(msg)) {
        // AJAX request to delete the user
        $.ajax({
            url: `/admin/deleteRecord?model=${model}&id=${id}`,
            type: 'GET',
            success: function(response) {
                alert(response.message);
                $('#dynamic-datatable').DataTable().ajax.reload(); // reload table
            },
            error: function(err) {
                alert('Error deleting user.');
            }
        });
    }
}


function changeStatus(model, id, status, lng) {
    if(lng == 'en' || lng == 'en-US') {
        var msg = 'Are you sure you want to change the status?';
    }
    else {
        var msg = '¿Estás seguro de que deseas cambiar el estado?';
    }
    if (confirm(msg)) {
        // AJAX request to delete the user
        $.ajax({
            url: `/admin/changeStatus?model=${model}&id=${id}&status=${status}`,
            type: 'GET',
            success: function(response) {
                //console.log(response);
                alert(response.message);
                $('#dynamic-datatable').DataTable().ajax.reload(); // reload table
            },
            error: function(err) {
                alert('Error changing status');
            }
        });
    }
}