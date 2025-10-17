import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { MdCheck } from "react-icons/md";

// Colors used in your design
const completedGreen = "#22A455 !important";
const activeBlue = "#495AFF !important";
const grayInactive = "#D1D5DB";
const size = 20;

// Custom connector line with no extra spacing on x-axis
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: size / 2 - 1, // -1 for border
    left: "calc(-50% + 25px)",
    right: "calc(50% + 25px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: completedGreen,
      borderRadius: 1,
      height: 2,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: completedGreen,
      borderRadius: 1,
      height: 2,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderRadius: 1,
    height: 2,
    backgroundColor: grayInactive,
  },
}));

// Custom step icon that uses react-icon MdCheck on completed step and empty or filled circle otherwise
const CustomStepIconRoot = styled("div")(({ ownerState }) => ({
  zIndex: 1,
  width: size,
  height: size,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: ownerState.completed ? completedGreen : "transparent",
  border: ownerState.active
    ? ".5px solid #495AFF"
    : ownerState.completed
    ? ".5px solid #22A455"
    : ".5px solid #D1D5DB", // light gray for future steps,
  position: "relative",
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;

  if (completed) {
    // Completed: Green filled circle with check
    return (
      <CustomStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        <MdCheck size={14} color="#fff" />
      </CustomStepIconRoot>
    );
  }

  if (active) {
    // Active: Outlined blue + blue dot
    return (
      <CustomStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#535BF2",
            display: "block",
          }}
        />
      </CustomStepIconRoot>
    );
  }

  // Upcoming: Outlined gray circle, empty center
  return (
    <CustomStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    />
  );
}

CustomStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  className: PropTypes.string,
};

const steps = [
  "Provide Details",
  "Verify OTP",
  "Business Details",
  "Bank Details",
];

export default function SellerOnboardingStepper({ activeStep }) {
  return (
    <Stack sx={{ width: "100%" }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<CustomConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                "& .MuiStepLabel-label": {
                  fontWeight: "500",
                  fontSize: "14px",
                  marginTop: "10px !important",
                  fontFamily: "Outfit",
                  color:
                    activeStep === index
                      ? activeBlue
                      : activeStep > index
                      ? completedGreen
                      : grayInactive,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
