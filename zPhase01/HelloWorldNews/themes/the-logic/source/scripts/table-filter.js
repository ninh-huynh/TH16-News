$(function() {
    var $header = $table.find('thead');
    var field = 'date';
    var html = [];
    var userTarget = '';
    
    
    var $th = $header.find('tr [data-field="date"] .fht-cell');
    
    html.push(`
    <div class="input-daterange input-group">
        <input type="text" class="input-sm form-control" name="start" id="from" autocomplete="off"/>
        <div class="input-group-append">
            <span class="input-group-text">Đến</span>
        </div>
        <input type="text" class="input-sm form-control" name="end" id="to" autocomplete="off" />
    </div>
    `);
        $th.html(html);

    $('.jumpto').find('.btn').prop('title', 'Đi').text('Đi');
    $('.keep-open').find('.btn').prop('title', 'Columns');

    $('.input-daterange').datepicker({
        format: 'd-m-yyyy',
        autoclose: true,
        clearBtn: true,
    }).on('changeDate', function (ev) {
        if (userTarget === "start") {
            $('#from').val(ev.format());
        }
        else if (userTarget === "end") {
            $('#to').val(ev.format());
    
            var from = toDate($('#from').val());
            var to = toDate($('#to').val());
            
            var data = $table.bootstrapTable('getData');
            
            $table.bootstrapTable('load', $.grep(data, function (row) { date = toDate(row.date); return date >= from && date <= to;}));
        }
    });
    
    $('.input-daterange').on('focusin', function(e) {
        userTarget = $(e).attr('target').name;
    }); 

    $('.filter-show-clear').on('click', function() {
        $table.bootstrapTable('load', tableData);
    })
})

function toDate(dateStr) {
    var parts = dateStr.split("-")
    return new Date(parts[2], parts[1] - 1, parts[0])
}