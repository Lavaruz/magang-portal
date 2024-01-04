let RECRUITER_ID
let COMPLETION_COUNT = 0
const USER_ID = $("#user_id").text()

$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {
    RECRUITER_ID = seekerData.recruiter.id
    $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {

        $("#basic-org-name").text(recruiterData.rec_org_name)
        $("#basic-org-desc span").text(recruiterData.rec_org_desc)
        $("#basic-org-size").text(recruiterData.rec_org_size)
        $("#basic-org-year").text(recruiterData.rec_org_year)
        $("#basic-org-website").text(`${recruiterData.rec_org_website.length > 28 ? recruiterData.rec_org_website.substring(0, 25) + "..." : recruiterData.rec_org_website}`)
        $("#basic-org-website").attr("href",recruiterData.rec_org_website)
        $("#basic-org-address").text(recruiterData.rec_org_address)
        $("#popup-org-name").val(recruiterData.rec_org_name)
        $("#popup-org-desc").val(recruiterData.rec_org_desc)
        $("#popup-org-size").val(recruiterData.rec_org_size)
        $("#popup-org-year").val(recruiterData.rec_org_year)
        $("#popup-org-website").val(recruiterData.rec_org_website)
        $("#popup-org-address").val(recruiterData.rec_org_address)
        $("#profile-viewers").text(recruiterData.rec_profile_view)


        if(recruiterData.rec_org_logo){
            $("#basic-org-logo").attr("src", recruiterData.rec_org_logo);
            $("#popup-org-logo").attr("src", recruiterData.rec_org_logo);
        }

        if(recruiterData.rec_verified){
            $(".recruiter-verification").remove()
        }

        if(recruiterData.rec_org_name && recruiterData.rec_org_desc && recruiterData.rec_org_size && recruiterData.rec_org_year && recruiterData.rec_org_website && recruiterData.rec_org_website){
            $("#completion-basic-info").remove()
            COMPLETION_COUNT += 33
        }
        if(recruiterData.rec_description){
            $("#completion-description").remove()
            COMPLETION_COUNT += 33
        }
        if(recruiterData.gallery.length !== 0){
            $("#completion-gallery").remove()
            COMPLETION_COUNT += 33
        }

        if(COMPLETION_COUNT == 99){
            $(".profie-completion").remove()
        }

        $("#completion_rate").text(COMPLETION_COUNT)


        if(recruiterData.rec_banner){
            $("#label-org-banner div").addClass("hidden")
            $("#label-org-banner").css("background-image", `url('${recruiterData.rec_banner}')`)
        }

        if(recruiterData.rec_description){
            let paragraph = recruiterData.rec_description.split('\n')
            $("#description").html(paragraph.join("</br>")).addClass("font-second text-sm text-white-80 font-medium")
            $("#popup-description-textarea").val(`${seekerData.profile_summary}`)
        }

        if(recruiterData.gallery.length !== 0){
            $("#gallery").html("")
            recruiterData.gallery.forEach(photo => {
                // DISPLAY ON PROFILE
                $("#gallery").append(`
                    <div class="">
                        <div class="overflow-hidden w-[240px] h-[240px] bg-darkest-grey rounded-lg flex justify-center items-center cursor-pointer">
                            <img src="${photo.gal_photo}" alt="profile-picture" class="w-full h-full object-cover">
                        </div>
                    </div>
                `)

                // POPUP GALLERY
                $(`
                    <div class="relative">
                        <p class="hidden gallery-id">${photo.id}</p>
                        <div class="overflow-hidden w-[240px] h-[240px] bg-darkest-grey rounded-lg flex justify-center items-center">
                            <img src="${photo.gal_photo}" alt="profile-picture" class="w-full h-full object-cover">
                        </div>
                        <div class="absolute top-[-12px] right-[-12px] w-[24px] h-[24px] rounded-full bg-white flex items-center justify-center cursor-pointer delete-gallery">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4.66675 14C4.30008 14 3.98619 13.8694 3.72508 13.6083C3.46397 13.3472 3.33341 13.0333 3.33341 12.6667V4H2.66675V2.66667H6.00008V2H10.0001V2.66667H13.3334V4H12.6667V12.6667C12.6667 13.0333 12.5362 13.3472 12.2751 13.6083C12.014 13.8694 11.7001 14 11.3334 14H4.66675ZM6.00008 11.3333H7.33341V5.33333H6.00008V11.3333ZM8.66675 11.3333H10.0001V5.33333H8.66675V11.3333Z" fill="#AAAAAA"/>
                            </svg>
                        </div>
                    </div>
                `).insertBefore($("#popup-add-gallery"))
            })
            if(recruiterData.gallery.length >= 4) $("#popup-add-gallery").remove()
        }









        // update description organisation
        updateSeekerData("form-description", `/api/v1/recruiter/${RECRUITER_ID}`,"PUT")
        
        updateSeekerData("form-org-basic-information", `/api/v1/recruiter/${RECRUITER_ID}`,"PUT")

        updateSeekerData("form-verification", `/api/v1/recruiter/${RECRUITER_ID}/verification`,"PUT")



        // update banner organisation
        $("#input-org-banner").change(function(){
            let selectedImage = this.files[0];
            if(selectedImage){
                updateSeekerData("form-org-banner", `/api/v1/recruiter/${RECRUITER_ID}`,"PUT")
                $(`#form-org-banner`).submit()
            }
        })

        
        $("#button-add-gallery").click(function(){
            $("#input-gallery").click()
        })

        $("#input-gallery").change(function(){
            let selectedImage = this.files[0];
            if(selectedImage){
                const imageUrl = URL.createObjectURL(selectedImage);
                $(`
                    <div class="relative">
                        <div class="overflow-hidden w-[240px] h-[240px] bg-darkest-grey rounded-lg flex justify-center items-center cursor-pointer">
                            <img src="${imageUrl}" alt="profile-picture" class="w-full h-full object-cover">
                        </div>
                    </div>
                `).insertBefore($("#popup-add-gallery"))
                const form_update = document.getElementById("form-add-gallery");
                let formData = new FormData(form_update)
                $.ajax({
                    url: `/api/v1/recruiter/${RECRUITER_ID}/gallery`,
                    type: "POST",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    encrypt: "multipart/form-data",
                    success: (response) => {
                        if(response.status_code == 200){
                            console.log(response);
                        }
                    },
                    error: function (request, status, error) {
                        alert("Error!")
                    },
                });
                $("form-add-gallery").submit()
            }
        })
    })
})

$("#edit-basic-info, #completion-basic-info").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-basic").removeClass("hidden")
    $("body").addClass('no-scroll');
})

$("#edit-description, #button-description, #completion-description").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-description").removeClass("hidden")
    $("body").addClass('no-scroll');
})

$("#edit-gallery, #button-gallery, #completion-gallery").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-gallery").removeClass("hidden")
    $("body").addClass('no-scroll');
})

$("#button-verification").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-verification").removeClass("hidden")
    $("body").addClass('no-scroll');
})

$(".close-x").click(function(){
    $(this).closest('.popup').addClass("hidden")
    $(this).closest('#popup').addClass("hidden")
    $("body").removeClass('no-scroll');
})

$("#navbar-recruiter").removeClass("hidden")

$("#button-org-logo").click(function(){
    $("#input-org-logo").click()
})

$("#input-org-logo").on("change", function() {
    const selectedImage = this.files[0];
    if (selectedImage) {
        const imageUrl = URL.createObjectURL(selectedImage);
        $("#popup-org-logo").attr("src", imageUrl);
    } else {
        $("#popup-org-logo").attr("src", "/img/Ellipse 3.svg");
    }
});

$("#button-save-gallery").click(function(){
    location.reload()
})

$("#popup-input-company-domain").on('input', function() {
    var regex = /^(?!.*@(gmail|yahoo)\.com$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let testValidation = regex.test($(this).val());

    if (testValidation) {
        $("#button-send-code").prop('disabled', false);
    } else {
        $("#button-send-code").prop('disabled', true);
    }
});

$(".button-next").click(function(){
    let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
    $(".body-percent").eq(body_percent_idx).addClass("hidden")
    $(".body-percent").eq(body_percent_idx+1).removeClass("hidden")
})

$(".button-back").click(function(){
    let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
    $(".body-percent").eq(body_percent_idx).addClass("hidden")
    $(".body-percent").eq(body_percent_idx-1).removeClass("hidden")
})

$("#popup-container-gallery").on("click",".delete-gallery",function(){
    const GALLERY_ID = $(this).parent().find(".gallery-id").text()
    $(this).parent().remove()
})







$("#add-experience").click(function(){
    $("#registered-experience").addClass("hidden")
    $("#adding-new-experience").removeClass("hidden")
})

$("#add-education").click(function(){
    $("#registered-education").addClass("hidden")
    $("#adding-new-education").removeClass("hidden")
})

$(".cancle-add").click(function(){
    $(this).closest(".body").find(".additional-popup").addClass("hidden")
    $(this).closest(".body").find(".main-popup").removeClass('hidden')
})

$("#still-work-here").change(function(){
    if($(this).is(":checked")){
        $("input[name=exp_enddate]").prop("disabled", true)
    }else{
        $("input[name=exp_enddate]").prop("disabled", false)
    }
})

$("#active-search").change(function(){
    $(this).val($(this).is(":checked"))
    const form_update = document.getElementById("form-update-active-search");
    const formData = new FormData(form_update)
    if($(this).val() == "false") formData.append("active_search", false)
    
    $.ajax({
        url: `/api/v1/seeker/${USER_ID}`,
        type: "PUT",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
            if(response.status_code == 200){
                location.reload()
            }
        },
        error: function (request, status, error) {
            alert("Error!")
        },
    });
})

$("#button-input-resume").click(function(){
    $("#custom-input-resume").click()
})

$(".delete-attachment").click(function(){
    const ATTACHMENT_NAME = $(this).closest(".attachment-body").find(".field_name").text()
    updateSeekerDataWithoutForm(`/api/v1/seeker/${USER_ID}/attachment/${ATTACHMENT_NAME}`, "DELETE")
})

$("#popup-recruiter-org").find("input").on("input", function(){
    const nonEmptyInputs = $("#popup-recruiter-org").find("input").filter(function() {
        return $(this).val().length > 0;
    });

    if(nonEmptyInputs.length === 5){
        $("#button-recruiter-org").prop("disabled", false)
    }else{
        $("#button-recruiter-org").prop("disabled", true)
    }
})

$("#popup-recruiter-info").find("input").on("input", function(){
    const nonEmptyInputs = $("#popup-recruiter-info").find("input").filter(function() {
        return $(this).val().length > 0;
    });

    if(nonEmptyInputs.length === 4){
        $("#button-recruiter-info").prop("disabled", false)
    }else{
        $("#button-recruiter-info").prop("disabled", true)
    }
})







// -------- update basic information data -------- 
updateSeekerData("form-basic-information", `/api/v1/seeker/${USER_ID}`,"PUT")


// -------- update profile experiences -------- 
// ADD
updateSeekerData("form-add-experience", `/api/v1/seeker/${USER_ID}/experience`, "POST")


// -------- add profile educations -------- 
// ADD
updateSeekerData("form-add-education", `/api/v1/seeker/${USER_ID}/education`, "POST")


// -------- add attachment -------- 
updateSeekerData("form-add-attachment", `/api/v1/seeker/${USER_ID}/attachment`, "POST")

// -------- Delete EDUCATION || EXPERIENCE ---------
$("#popup").on("click", ".delete-svg-button", function(){
    const CARD_EXPERIENCE_ID = $(this).closest(".card-experience").find(".id").text()
    const CARD_EDUCATION_ID = $(this).closest(".card-education").find(".id").text()
    let confirmDeletion = confirm("Are you sure?")
    if(CARD_EDUCATION_ID && confirmDeletion){
        updateSeekerDataWithoutForm(`/api/v1/seeker/${USER_ID}/education/${CARD_EDUCATION_ID}`, "DELETE")
    }
    if(CARD_EXPERIENCE_ID && confirmDeletion){
        updateSeekerDataWithoutForm(`/api/v1/seeker/${USER_ID}/experience/${CARD_EXPERIENCE_ID}`, "DELETE")
    }
})

updateSeekerData("form-register-recruiter", `/api/v1/seeker/${USER_ID}/recruiter`, "POST")



function updateSeekerData(formId, URL, method){
    const form_update = document.getElementById(formId);
    $(`#${formId}`).submit(function(e){
        e.preventDefault();
        let formData = new FormData(form_update)
        $.ajax({
            url: URL,
            type: method,
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            encrypt: "multipart/form-data",
            processData: false,
            success: (response) => {
                if(response.status_code == 200){
                    location.reload()
                }
            },
            error: function (request, status, error) {
                alert("Error!")
            },
        });
    })
}

function updateSeekerDataWithoutForm(URL, method){
    $.ajax({
        url: URL,
        type: method,
        success: function (response) {
            if(startsWithTwo(response.status_code)){
                location.reload()
            }
        },
        error: function (error) {
            alert("Error")
        }
    });
}

function startsWithTwo(input) {
    const regex = /^2\d+/; // '^2' menunjukkan input harus dimulai dengan '2', dan '\d+' menunjukkan satu atau lebih digit.
    return regex.test(input);
}