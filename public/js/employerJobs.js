$(document).ready(function(){
    $.get("/api/users/token", function(users){
        users = users.datas;
        $(".email").text(users.email)
        $(".account").text(`${users.firstname} ${users.lastname}`)

        if(users.Companies.length !== 0){
            $(".jobs-main").html("").append(`
            <table id="jobs-table" class="display" style="width: 100%">
                <thead>
                <tr>
                    <th>No.</th>
                    <th>Job Name</th>
                    <th>Company Name</th>
                </tr>
                </thead>
            </table>
            `).css("padding","0 3rem").removeClass("text-center")
            $("#jobs-table").DataTable({
                ajax: {
                  url: "/api/users/token",
                  dataSrc: "datas.Companies",
                },
                columns: [
                  {
                    data: null,
                    render: function (data, type, row, meta) {
                      return meta.row + meta.settings._iDisplayStart + 1;
                    },
                  },
                  { data: "Jobs[0].job_title" },
                  { data: "company_name" },
                ]})
        }
    })
})