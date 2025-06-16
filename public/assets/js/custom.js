function deleteRecord(model, id) {
    if (confirm('Are you sure you want to delete this row?')) {
        // AJAX request to delete the user
        $.ajax({
            url: `/admin/deleteRecord?model=${model}&id=${id}`,
            type: 'GET',
            success: function(response) {
                alert('Row deleted successfully!');
                $('#dynamic-datatable').DataTable().ajax.reload(); // reload table
            },
            error: function(err) {
                alert('Error deleting user.');
            }
        });
    }
}


function changeStatus(model, id, status) {
    if (confirm('Are you sure you want to change the status?')) {
        // AJAX request to delete the user
        $.ajax({
            url: `/admin/changeStatus?model=${model}&id=${id}&status=${status}`,
            type: 'GET',
            success: function(response) {
                alert('Status changed successfully!');
                $('#dynamic-datatable').DataTable().ajax.reload(); // reload table
            },
            error: function(err) {
                alert('Error changing status');
            }
        });
    }
}