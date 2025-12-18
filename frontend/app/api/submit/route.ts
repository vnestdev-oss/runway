import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { sendApplicationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract all form fields
    const studentDetails = {
      fullName: formData.get("fullName") as string,
      registerNumber: formData.get("registerNumber") as string,
      contactNumber: formData.get("contactNumber") as string,
      email: formData.get("email") as string,
      schoolDepartment: formData.get("schoolDepartment") as string,
      yearOfStudy: formData.get("yearOfStudy") as string,
    };

    const startupAbstract = {
      startupName: formData.get("startupName") as string,
      problemStatement: formData.get("problemStatement") as string,
      proposedSolution: formData.get("proposedSolution") as string,
      targetUsers: formData.get("targetUsers") as string,
      innovation: formData.get("innovation") as string,
      pptLink: formData.get("pptLink") as string,
    };

    const facultyMentor = {
      facultyName: formData.get("facultyName") as string,
      facultyDepartment: formData.get("facultyDepartment") as string,
      facultyEmail: formData.get("facultyEmail") as string,
      facultyContact: formData.get("facultyContact") as string,
      facultyEmployeeId: formData.get("facultyEmployeeId") as string,
    };

    const resourcesJson = formData.get("resources") as string;
    let resources = [];
    try {
      resources = resourcesJson ? JSON.parse(resourcesJson) : [];
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid resources data format",
        },
        { status: 400 }
      );
    }

    const consent = formData.get("consent") === "true";

    const pptFile = formData.get("pptFile") as File | null;

    // Initialize Supabase client
    const supabase = getServiceSupabase();
    
    let pptFileUrl = null;

    // Upload PPT file to Supabase Storage if present
    if (pptFile) {
      const fileExt = pptFile.name.split('.').pop();
      const fileName = `${studentDetails.registerNumber}_${Date.now()}.${fileExt}`;
      const filePath = `applications/${fileName}`;

      const fileBuffer = await pptFile.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET || 'application-files')
        .upload(filePath, fileBuffer, {
          contentType: pptFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        throw new Error("Failed to upload PPT file");
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET || 'application-files')
        .getPublicUrl(filePath);

      pptFileUrl = urlData.publicUrl;
    }

    const submittedAt = new Date().toISOString();

    // Insert application data into database
    const { data: applicationData, error: applicationError } = await supabase
      .from('applications')
      .insert({
        full_name: studentDetails.fullName,
        register_number: studentDetails.registerNumber,
        contact_number: studentDetails.contactNumber,
        email: studentDetails.email,
        school_department: studentDetails.schoolDepartment,
        year_of_study: studentDetails.yearOfStudy,
        startup_name: startupAbstract.startupName,
        problem_statement: startupAbstract.problemStatement,
        proposed_solution: startupAbstract.proposedSolution,
        target_users: startupAbstract.targetUsers,
        innovation: startupAbstract.innovation,
        ppt_link: startupAbstract.pptLink,
        ppt_file_url: pptFileUrl,
        faculty_name: facultyMentor.facultyName,
        faculty_department: facultyMentor.facultyDepartment,
        faculty_email: facultyMentor.facultyEmail,
        faculty_contact: facultyMentor.facultyContact,
        faculty_employee_id: facultyMentor.facultyEmployeeId,
        consent: consent,
        submitted_at: submittedAt,
      })
      .select()
      .single();

    if (applicationError) {
      console.error("Database insert error:", applicationError);
      throw new Error("Failed to save application to database");
    }

    // Insert resources if any
    if (resources.length > 0) {
      const resourcesData = resources.map((resource: any) => ({
        application_id: applicationData.id,
        resource_name: resource.resourceName || null,
        description: resource.description || null,
        cost: resource.cost || 0,
        link: resource.link || null,
      }));

      const { error: resourcesError } = await supabase
        .from('resources')
        .insert(resourcesData);

      if (resourcesError) {
        console.error("Resources insert error:", resourcesError);
        // Continue even if resources fail - application is already saved
      }
    }

    // Send email notification in parallel (don't wait for it)
    const emailData = {
      fullName: studentDetails.fullName,
      registerNumber: studentDetails.registerNumber,
      email: studentDetails.email,
      startupName: startupAbstract.startupName,
      problemStatement: startupAbstract.problemStatement,
      proposedSolution: startupAbstract.proposedSolution,
      facultyName: facultyMentor.facultyName,
      facultyEmail: facultyMentor.facultyEmail,
      resources: resources,
      submittedAt: submittedAt,
    };

    // Send email without blocking response
    sendApplicationEmail(emailData).catch((error) => {
      console.error("Email sending error:", error);
      // Don't fail the request if email fails
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          applicationId: applicationData.id,
          submittedAt: submittedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred during submission",
      },
      { status: 500 }
    );
  }
}

