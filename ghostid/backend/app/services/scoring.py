def get_tier(score: float) -> tuple[str, str]:
    if score >= 85:
        return "SILENT_PASS", "log_only"
    elif score >= 70:
        return "SOFT_NUDGE", "one_tap_confirm"
    elif score >= 40:
        return "TYPING_CHALLENGE", "randomized_phrase"
    else:
        return "HARD_STOP", "sdk_callback"
